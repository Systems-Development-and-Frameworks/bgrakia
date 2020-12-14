const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require("apollo-server");
const {beforeEach, describe, expect, it} = require("@jest/globals");
const PostsAPI = require("../datasources/postApi");
const UsersAPI = require("../datasources/userApi");
const AuthAPI = require("../datasources/authenticationApi");
const typeDefs = require('../typeDefs');
const resolvers = require('../resolvers');
const permissions = require('../security/permissions');
const { v4: uuidv4 } = require('uuid');
const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema } = require('graphql-tools');
const jwt = require('jsonwebtoken');

let usersApi = new UsersAPI();
let postsApi = new PostsAPI();
let authApi = new AuthAPI();

const schema = applyMiddleware(
    makeExecutableSchema({
        typeDefs,
        resolvers,
    }),
    permissions,
);

let reqMock;
let resMock;
const context = require('../context');
const contextPipeline = () => context({ req: reqMock, res: resMock });

const server = new ApolloServer({
    schema,
    context: contextPipeline,
    dataSources: () => {
        return {
          usersApi: usersApi,
          postsApi: postsApi,
          authApi: authApi
        }
    }
});

let mike_auth_token = '';
let atanas_auth_token = '';

const { query, mutate } = createTestClient(server);

beforeEach(async () => {
    process.env.JWT_SECRET='TEST_SECRET';
    // For me a mock express.Request containing some headers is enough.
    // I assume typescript will complain here:
    reqMock = { headers: {} };
    resMock = {};

    let userIds = [uuidv4(), uuidv4()];

    mike_auth_token = await authApi.createToken(userIds[0]);
    atanas_auth_token = await authApi.createToken(userIds[1]);

    postsApi.posts = [
        { title: "Mike's Post 1", votes: 0, upvoters:[], author: userIds[0] },
        { title: "Mike's Post 2", votes: 0, upvoters:[], author: userIds[0] },
        { title: "Atanas's Post 1", votes: 0, upvoters:[], author: userIds[1] },
        { title: "Atanas's Post 2", votes: 0, upvoters:[], author: userIds[1] },
    ];

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

});

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
            { title: "Mike's Post 1", author: { name: 'Mike' } },
            { title: "Mike's Post 2", author: { name: 'Mike' } },
            { title: "Atanas's Post 1", author: { name: 'Atanas' } },
            { title: "Atanas's Post 2", author: { name: 'Atanas' } },
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
                name: "Mike",
                posts: [
                    {
                        title: "Mike's Post 1",
                        votes: 0,
                    },
                    {
                        title: "Mike's Post 2",
                        votes: 0,
                    }
                ]
            }, {
                name: "Atanas",
                posts: [
                    {
                        title: "Atanas's Post 1",
                        votes: 0,
                    },
                    {
                        title: "Atanas's Post 2",
                        votes: 0,
                    }
                ]
            }
        ]);
    });
  
});

describe("write(post: $postInput)", () => {

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
    });

    it("creates no post - not authenticated", async () => {
        const {
            errors:[ error ]
        } = await mutate({ mutation: WRITE_POST, variables: { post: { title: "Title1"}}});

        expect(error.message).toEqual('Not Authorised!');
    });

    it("creates new post - authenticated", async () => {
        reqMock.headers = {authorization: 'Bearer ' + atanas_auth_token};

        const {
            data: {write}
        } = await mutate({ mutation: WRITE_POST, variables: { post: { title: "Title1"} } });

        expect(write).toEqual({title: "Title1", author: {name: "Atanas"}});
    });

    it("throws error if author creates post with already existent title", async () => {
        reqMock.headers = {authorization: 'Bearer ' + atanas_auth_token};

        const {
            errors: [error]
        } = await mutate({ mutation: WRITE_POST, variables: { post: { title: "Atanas's Post 1" } } });

        expect(error.message).toEqual("Post with this title already exists.");
    });

    it("throws error if author doesn't exist", async () => {
        unvalidAuthToken = await authApi.createToken(uuidv4());
        reqMock.headers = {authorization: 'Bearer ' + unvalidAuthToken};

        const {
            errors: [error]
        } = await mutate({ mutation: WRITE_POST, variables: { post: { title: "Asdsdasd" } } });

        expect(error.message).toEqual("Not Authorised!");
    })
});

describe("upvote(title: String, voter: UserInput!)", () => {

    let UPVOTE_POST;
    beforeEach(() => {
        UPVOTE_POST = gql` 
            mutation UpvotePost($title: ID!) {
                upvote(title: $title) {
                    title, 
                    votes
                }
            }
        `;
    });

    it("upvotes a post - not authorized", async () => {
        const {
            errors:[ error ]
        } = await mutate({ mutation: UPVOTE_POST, variables: { title: "Atanas's Post 1" } });

        expect(error.message).toEqual('Not Authorised!');
    });

    it("upvotes a post - authorized", async () => {
        reqMock.headers = {authorization: 'Bearer ' + atanas_auth_token};

        const {
            data:{upvote},
        } = await mutate({ mutation: UPVOTE_POST, variables: { title: "Atanas's Post 1" } });

        expect(upvote).toMatchObject({ title: "Atanas's Post 1", votes: 1 });
    });

    it("throws error because post does not exist", async () => {
        reqMock.headers = {authorization: 'Bearer ' + atanas_auth_token};

        const {
            errors: [error]
        } = await mutate({ mutation: UPVOTE_POST, variables: { title: "nosuchpost" } });

        expect(error.message).toEqual("Not Authorised!");
    });

    it("throws error because voter does not exist", async () => {
        unvalidAuthToken = await authApi.createToken(uuidv4());
        reqMock.headers = {authorization: 'Bearer ' + unvalidAuthToken};

        const {
            errors: [error]
        } = await mutate({ mutation: UPVOTE_POST, variables: { title: "Atanas's Post 1", voter: { name: "bro" } } });

        expect(error.message).toEqual("Not Authorised!");
    });

    it("throws error because voter already voted on this post", async () => {
        reqMock.headers = {authorization: 'Bearer ' + atanas_auth_token};
        const {
            data:{upvote},
        } = await mutate({ mutation: UPVOTE_POST, variables: { title: "Atanas's Post 1" } });

        const {
            errors: [error]
        } = await mutate({ mutation: UPVOTE_POST, variables: { title: "Atanas's Post 1" } });

        expect(error.message).toEqual("You've already upvoted this post");
    })
});
