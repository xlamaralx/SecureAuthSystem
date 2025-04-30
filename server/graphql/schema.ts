export const typeDefs = `#graphql
  scalar DateTime

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: DateTime!
    expirationDate: DateTime
  }

  type AuthPayload {
    user: User
    message: String
    requiresTwoFactor: Boolean
    email: String
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    role: String
    expirationDate: DateTime
  }

  input UserUpdateInput {
    name: String
    email: String
    password: String
    role: String
    expirationDate: DateTime
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input TwoFactorInput {
    email: String!
    code: String!
  }

  input ForgotPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
  }

  type Query {
    me: User
    users: [User]!
    user(id: ID!): User
  }

  type Mutation {
    register(input: UserInput!): User
    login(input: LoginInput!): AuthPayload
    verifyTwoFactor(input: TwoFactorInput!): User
    forgotPassword(input: ForgotPasswordInput!): String
    resetPassword(input: ResetPasswordInput!): String
    logout: Boolean
    createUser(input: UserInput!): User
    updateUser(id: ID!, input: UserUpdateInput!): User
    deleteUser(id: ID!): Boolean
  }
`;
