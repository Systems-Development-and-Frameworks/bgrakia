const { createTestClient } = require('apollo-server-testing');
const { gql } = require("apollo-server");
const {beforeEach, afterAll, describe, expect, it} = require("@jest/globals");
const authService = require('../services/tokens');
const actualContext = require('../context');
const User = require('../domain/User')
const Post = require('../domain/Post')
const Server = require('../server');

let query;
let mutate;
let requestMock;
const context = () => actualContext({req: requestMock, authService});

const cleanDatabase = async () => {
    const { driver } = context();
    await driver.session().writeTransaction(txc => txc.run("MATCH(n) DETACH DELETE n;"));
}

beforeEach(async () => {
    requestMock = { headers: {} };
    await cleanDatabase();
    const server = Server({ context })
    const testClient = createTestClient(server);
    ({ query, mutate } = testClient);
})

afterAll(async () => {
    await cleanDatabase();
    const { driver } = context();
    await driver.close();
})

describe('Query', () => {
    beforeEach(async () => {
        const bob = new User('Bob', 'bob@mail.com', 'bobby');
        const alice = new User('Alice', 'alice@mail.com', 'alice');
        const { driver } = context();
        const session = driver.session();
        await User.save(session, bob);
        await User.save(session, alice);

        const bobPost = new Post('Bob Post');
        const alicePost = new Post('Alice Post');
        await Post.save(session, bobPost);
        await Post.save(session, alicePost);

        const linkBobWithPost = await session.writeTransaction((tx) =>
            tx.run('MATCH (u: User {id: $id}), (p: Post {title: $title}) CREATE (u)-[:AUTHORED]->(p) RETURN u',
              { id: bob.id, title: bobPost.title})
        )
        const linkAliceWithPost = await session.writeTransaction((tx) =>
          tx.run('MATCH (u: User {id: $id}), (p: Post {title: $title}) CREATE (u)-[:AUTHORED]->(p) RETURN u',
            { id: alice.id, title: alicePost.title})
        );
    })

    describe('users', () => {
        const GET_USERS = gql`
            query {
                users {
                    name
                    posts {
                        title
                        votes
                    }
                }
            }
        `;

        it('returns array of users', async () => {
            await expect(query({ query: GET_USERS })).resolves.toMatchObject({
                errors: undefined,
                data: {
                    users: [
                        { name: 'Alice', posts: [ { title: 'Alice Post', votes: 0 } ] },
                        { name: 'Bob', posts: [ { title: 'Bob Post', votes: 0 } ] },
                    ]
                }
            });
        });
    });

    describe('posts', () => {
        const GET_POSTS = gql`
            query {
                posts {
                    title
                    author {
                        name
                    }
                }
            }
        `;

        it ('returns array of posts', async () => {
            await expect(query({ query: GET_POSTS })).resolves.toMatchObject({
                errors: undefined,
                data: {
                    posts: [
                        { title: 'Bob Post', author: { name: 'Bob' } },
                        { title: 'Alice Post', author: { name: 'Alice'} }
                    ]
                }
            });
        })
    })
});

describe('Mutation', () => {


    describe('login', () => {
        const LOGIN = gql`
            mutation($email: String!, $password: String!) {
                login(email: $email, password: $password)
            }
        `;

        beforeEach(async () => {
            const alice = new User('Alice', 'alice@mail.com', 'alice');
            const { driver } = context();
            const session = driver.session();
            await User.save(session, alice);
        });

        it('identifies wrong passwords', async () => {
            const variables = { email: 'alice@mail.com', password: 'wrongpassword' };
            await expect(mutate( { mutation: LOGIN, variables })).resolves.toMatchObject({
                errors: [
                  expect.objectContaining({
                      message: 'Password is invalid.',
                  })
                ],
                data: {
                    login: null,
                }
            });
        });

        it('identifies wrong emails', async () => {
            const variables = { email: 'alice@nosuchemail.com', password: 'alice' };
            await expect(mutate( { mutation: LOGIN, variables })).resolves.toMatchObject({
                errors: [
                    expect.objectContaining({
                        message: "You don't exist.",
                    })
                ],
                data: {
                    login: null
                }
            });
        })

        it('authenticates users with valid inputs', async () => {
            const variables = { email: 'alice@mail.com', password: 'alice'};
            await expect(mutate( { mutation: LOGIN, variables })).resolves.toMatchObject({
                errors: undefined,
                data: {
                   login: expect.any(String)
                }
            });
        })
    });

    describe('signup', () => {
        const SIGNUP = gql`
            mutation($name: String!, $email: String!, $password: String!) {
                signup(name: $name, email: $email, password: $password)
            }
        `;

        it('makes sure the password is long enough', async () => {
            const variables = { name: 'Test', email: 'Test', password: 'test'};
            await expect(mutate( { mutation: SIGNUP, variables})).resolves.toMatchObject({
                errors: [
                  expect.objectContaining({
                      message: "The password must be at least 8 characters long."
                  })
                ],
                data: {
                    signup: null
                }
            })
        });

        it ('makes sure the email is not taken by another user', async () => {
            const alice = new User('Alice', 'alice@mail.com', 'aliceInWonderland');
            const { driver } = context();
            const session = driver.session();
            await User.save(session, alice);
            const variables = { name: alice.name, email: alice.email, password: alice.password};
            await expect(mutate( { mutation: SIGNUP, variables})).resolves.toMatchObject({
                errors: [
                  expect.objectContaining({
                      message: "A user with this email already exists."
                  })
                ],
                data: {
                    signup: null
                }
            })
        });

        it('creates a user with valid email and password', async () => {
            const variables = { name: 'Bob', email: 'bob@mail.com', password: 'bobbyBoy'}
            await expect(mutate({ mutation: SIGNUP, variables})).resolves.toMatchObject({
                errors: undefined,
                data: {
                    signup: expect.any(String)
                }
            })
        });
    });

    describe('write', () => {
        const WRITE_POST = gql`
            mutation($post: PostInput!) {
                write(post: $post) {
                    title,
                    author {
                        name
                    }
                }
            }
        `;

        beforeEach(async () => {
            const bob = new User('Bob', 'bob@mail.com', 'bobby');
            const { driver } = context();
            const session = driver.session();
            await User.save(session, bob);

            const bobPost = new Post('Bob Post');
            await Post.save(session, bobPost);

            const linkBobWithPost = await session.writeTransaction((tx) =>
              tx.run('MATCH (u: User {id: $id}), (p: Post {title: $title}) CREATE (u)-[:AUTHORED]->(p) RETURN u',
                { id: bob.id, title: bobPost.title})
            )
            const { authService } = context();
            requestMock = { headers: { authorization: 'Bearer ' + authService.issueToken(bob.id)}};
        })

        it('does not create a post if the title is taken', async () => {
            const variables = { post: {title: 'Bob Post'} };

            await expect(mutate( { mutation: WRITE_POST, variables } )).resolves.toMatchObject({
                errors: [
                  expect.objectContaining({
                      message: 'Post with this title already exists.'
                  })
                ],
                data: {
                    write: null
                }
            })
        });

        it('does not create a post if not authenticated', async () => {
            const { authService } = context();
            requestMock = { headers: { authorization: 'Bearer ' + authService.issueToken('blah')}};
            const variables = { post: {title: 'New Post'} };
            await expect(mutate( { mutation: WRITE_POST, variables } )).resolves.toMatchObject({
                errors: [
                    expect.objectContaining({
                        message: 'Not Authorised!'
                    })
                ],
                data: {
                    write: null
                }
            })
        })

        it('creates a post', async () => {
            const variables = { post: {title: 'New Post'} };
            await expect(mutate( { mutation: WRITE_POST, variables })).resolves.toMatchObject({
                errors: undefined,
                data: {
                    write: {
                        title: 'New Post',
                        author: {
                            name: 'Bob'
                        }
                    }
                }
            });
        });
    });

    describe('upvote', () => {
        const UPVOTE_POST = gql`
            mutation ($title: ID!) {
                    upvote(title: $title) {
                        title,
                        votes
                    }
            }
        `;
        let bob;
        let alice;
        beforeEach(async () => {
            bob = new User('Bob', 'bob@mail.com', 'bobby');
            alice = new User('Alice', 'alice@mail.com', 'alice');
            const { driver } = context();
            const session = driver.session();
            await User.save(session, bob);
            await User.save(session, alice);

            const bobPost = new Post('Bob Post');
            await Post.save(session, bobPost);

            const linkBobWithPost = await session.writeTransaction((tx) =>
              tx.run('MATCH (u: User {id: $id}), (p: Post {title: $title}) CREATE (u)-[:AUTHORED]->(p) RETURN u',
                { id: bob.id, title: bobPost.title})
            )
            const linkAliceWithPost = await session.writeTransaction((tx) =>
              tx.run('MATCH (u: User {id: $id}), (p: Post {title: $title}) CREATE (u)-[:LIKED]->(p) RETURN u',
                { id: alice.id, title: bobPost.title})
            );
        });

        it('does not upvote a post if unauthenticated', async () => {
            const variables = { title: 'Bob Post'};
            await expect(mutate( { mutation: UPVOTE_POST, variables })).resolves.toMatchObject({
                errors: [
                    expect.objectContaining({
                        message: 'Not Authorised!'
                    })
                ],
                data: {
                    upvote: null
                }
            });
        });

        it('does not upvote a post if post does not exist', async () => {
            const { authService } = context();
            const variables = { title: 'Test Post'};
            requestMock = { headers: { authorization: 'Bearer ' + authService.issueToken(bob.id)}};
            await expect(mutate( { mutation: UPVOTE_POST, variables })).resolves.toMatchObject({
                errors: [
                    expect.objectContaining({
                        message: "Post does not exist"
                    })
                ],
                data: {
                    upvote: null
                }
            });
        });

        it('does not upvote if already upvoted', async () => {
            const { authService } = context();
            requestMock = { headers: { authorization: 'Bearer ' + authService.issueToken(alice.id)}};

            const variables = { title: 'Bob Post'};
            await expect(mutate( { mutation: UPVOTE_POST, variables })).resolves.toMatchObject({
                errors: [
                    expect.objectContaining({
                        message: "You have already upvoted this post."
                    })
                ],
                data: {
                    upvote: null
                }
            });
        });

        it('upvotes successfully', async () => {
            const { authService } = context();
            requestMock = { headers: { authorization: 'Bearer ' + authService.issueToken(bob.id)}};

            const variables = { title: 'Bob Post'};
            await expect(mutate( { mutation: UPVOTE_POST, variables })).resolves.toMatchObject({
                errors: undefined,
                data: {
                    upvote: {
                        title: 'Bob Post',
                        votes: 1
                    }
                }
            });
        });

    });
});
