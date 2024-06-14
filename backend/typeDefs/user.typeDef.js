const userTypeDef = `#graphql
    type User {
        _id: ID!
        username: String!
        name: String!
        password: String!
        profilePicture: String
        gender: String!
        transactions: [Transaction!]
    }

    type Query {
        # users: [User!]
        authUser: User
        user(userId: ID!): User
    }

    type Mutation {
        signUp(input: SignUpInput!): User
        login(input: LoginInput!): User
        logout: LogoutRespose
    }

    input SignUpInput {
        username: String!
        name: String!
        password: String!
        gender: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    type LogoutRespose {
        message: String!
    }
`;

export default userTypeDef;