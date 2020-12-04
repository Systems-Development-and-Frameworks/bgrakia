const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require("apollo-server");
const {beforeEach, describe, expect, it} = require("@jest/globals");
const PostsAPI = require("../datasources/postApi");
const UsersAPI = require("../datasources/userApi");
const typeDefs = require('../typeDefs');
const resolvers = require('../resolvers');
const { v4: uuidv4 } = require('uuid');

let usersApi = new UsersAPI();

let postsApi = new PostsAPI();

const server = new ApolloServer({
    typeDefs, 
    resolvers, 
    dataSources: () => {
        return {
          usersApi: usersApi,
          postsApi: postsApi
        }
    }
});


const { query, mutate } = createTestClient(server);

beforeEach(() => {
    let userIds = [uuidv4(), uuidv4()];

    postsApi.posts = [
        { title: "Mike's Post 1", votes: 0, author: userIds[0] },
        { title: "Mike's Post 2", votes: 0, author: userIds[0] },
        { title: "Atanas's Post 1", votes: 0, author: userIds[1] },
        { title: "Atanas's Post 2", votes: 0, author: userIds[1] },
    ]

    usersApi.users = [
        {
            id: userIds[0],
            name: 'Mike',
            posts: postsApi.posts.slice(0, 2)
        },
        {
            id: userIds[1],
            name: 'Atanas',
            posts: postsApi.posts.slice(2, 4)
        },
    ];

})

describe("query", () => {
    
    it("posts with nested user object", async () => {
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

        const {
            data: { posts }
        } = await query({ query: GET_POSTS });

        expect(posts).toHaveLength(4);
        expect(posts).toEqual([
            { title: "Mike's Post 1", votes: 0, author: { name: 'Mike' } },
            { title: "Mike's Post 2", votes: 0, author: { name: 'Mike' } },
            { title: "Atanas's Post 1", votes: 0, author: { name: 'Atanas' } },
            { title: "Atanas's Post 2", votes: 0, author: { name: 'Atanas' } },
        ]);
    });

    it("users with nested post object", async () => {
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

        const {
            data: { users }
        } = await query({ query: GET_USERS });


        expect(users).toHaveLength(2);
        expect(users).toEqual([
            {
                name: "Peter",
                posts: [
                    {
                        title: "The Thing",
                        votes: 0
                    },
                    {
                        title: "The Nothing",
                        votes: 0
                    }
                ]
            }, 
            {
                name: "Max",
                posts: []
            }
        ]);
    });
  
});

/*describe("write(post: $postInput)", () => {

    let WRITE_POST;

    beforeEach(() => {
        WRITE_POST = gql`
            mutation WritePost($post: PostInput!) {
                write(post: $post) {
                    title, 
                    author {
                        name
                    }
                }
            }
        `;
    })

    it("creates new post", async () => {
        const {
            data: { write }
        } = await mutate({ mutation: WRITE_POST, variables: { post: { title: "Title1", author: { name: "Max" } } } });

        expect(write).toEqual({title: "Title1", author: {name: "Max"}});
    });

    it("throws error if author creates post with already existent title", async () => {    
        const {
            errors: [error]
        } = await mutate({ mutation: WRITE_POST, variables: { post: { title: "The Nothing", author: { name: "Max" } } } });

        expect(error.message).toEqual("Post with this title already exists.");
    });

    it("throws error if author doesn't exist", async () => {
        const {
            errors: [error]
        } = await mutate({ mutation: WRITE_POST, variables: { post: { title: "Asdsdasd", author: { name: "blahblah" } } } });

        expect(error.message).toEqual("No such author.");
    })
});

describe("upvote(title: String, voter: UserInput!)", () => {

    let UPVOTE_POST;
    beforeEach(() => {
        UPVOTE_POST = gql` 
            mutation UpvotePost($title: ID!, $voter: UserInput!) {
                upvote(title: $title, voter: $voter) {
                    title, 
                    votes
                }
            }
        `;
    });

    it("upvotes a post", async () => {
        const {
            data: {upvote}
        } = await mutate({ mutation: UPVOTE_POST, variables: { title: "The Nothing", voter: { name: "Max" } } });
        
        expect(upvote).toMatchObject({ title: "The Nothing", votes: 1 });
    });

    it("throws error because post does not exist", async () => {
        const {
            errors: [error]
        } = await mutate({ mutation: UPVOTE_POST, variables: { title: "nosuchpost", voter: { name: "Max" } } });
        
        expect(error.message).toEqual("Post with this title doesn't exist");
    });

    it("throws error because voter does not exist", async () => {
        const {
            errors: [error]
        } = await mutate({ mutation: UPVOTE_POST, variables: { title: "The Nothing", voter: { name: "bro" } } });
        
        expect(error.message).toEqual("No such voter.");
    })

    it("throws error because voter already voted on this post", async () => {

        const {
            errors: [error]
        } = await mutate({ mutation: UPVOTE_POST, variables: { title: "The Nothing", voter: { name: "Max" } } });
        
        expect(error.message).toEqual("This voter has already upvoted this article");
    })
});*/

