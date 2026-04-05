export const schema = `#graphql
type Query {
 users: [User]
 user(id: ID): User
 todos: [Todo]
 todo(id: ID!): Todo
 userTodos(userId: ID!): [Todo]
}

type Mutation {
 register(user: RegisteredUser!): User
 login(user: LoggedInUser!): LoginResponse
 addTodo(todo: NewTodoInput!): Todo
 updateTodo(id: ID!, todo: UpdateTodoInput!): Todo
 deleteTodo(id: ID!): String
 updateUser(id: ID!, user: UpdateUserInput!): User
 deleteUser(id: ID!): String
}

interface IUser {
 email: String
 username: String
}

enum S {
 done
 inprogress
 todo
}

type User implements IUser {
 _id: ID
 email: String
 username: String
 role: String
 todos: [Todo]
}

type Todo {
 _id: ID
 title: String
 status: S
 user: User
}

type LoginResponse {
 message: String
 token: String
}

input RegisteredUser {
 email: String!
 username: String!
 password: String!
 role: String
}

input LoggedInUser {
 email: String!
 password: String!
}

input NewTodoInput {
 title: String!
 status: S
}

input UpdateTodoInput {
 title: String
 status: S
}

input UpdateUserInput {
 username: String
 email: String
}
`;


