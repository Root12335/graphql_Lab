import { GraphQLError } from "graphql/error/GraphQLError.js";
import UserCollection from "./models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import TodoCollection from "./models/todos.js";

function assertLoggedIn(ctx) {
  if (!ctx.id || !ctx.role) {
    throw new GraphQLError(
      "You must send a valid login token in the Authorization header",
      {
        extensions: { code: "UNAUTHENTICATED" },
      },
    );
  }
}

export const resolvers = {
  Query: {
    users: async (_parent, _args, ctx) => {
      assertLoggedIn(ctx);
      const allUsers = await UserCollection.find();
      return allUsers;
    },
    user: async (_parent, { id }, ctx) => {
      assertLoggedIn(ctx);
      const singleUser = await UserCollection.findById(id);
      return singleUser;
    },
    todos: async (_parent, _args, ctx) => {
      assertLoggedIn(ctx);
      const allTodos = await TodoCollection.find();
      return allTodos;
    },
    todo: async (_parent, { id }, ctx) => {
      assertLoggedIn(ctx);
      const singleTodo = await TodoCollection.findById(id);
      return singleTodo;
    },
    userTodos: async (_parent, { userId }, ctx) => {
      assertLoggedIn(ctx);
      const todosForUser = await TodoCollection.find({ userId });
      return todosForUser;
    },
  },
  Mutation: {
    register: async (_parent, args) => {
      const newUser = await UserCollection.create(args.user);
      return newUser;
    },
    login: async (_parent, { user: credentials }) => {
      let { email, password } = credentials;

      if (!email || !password) {
        throw new GraphQLError("You must provide email and password", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const matchedAccount = await UserCollection.findOne({ email });
      if (!matchedAccount) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      console.log(password, matchedAccount.password);

      let passwordOk = await bcrypt.compare(password, matchedAccount.password);
      if (!passwordOk) {
        throw new GraphQLError("Invalid email or password", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      let token = jwt.sign(
        { id: matchedAccount._id, role: matchedAccount.role },
        process.env.SECRET,
      );
      return { message: "Loggedin success", token };
    },
    addTodo: async (_parent, { todo: payload }, ctx) => {
      if (ctx.id && ctx.role) {
        const inserted = await TodoCollection.create({
          title: payload.title,
          status: payload.status,
          userId: ctx.id,
        });
        return inserted;
      }
    },
    updateTodo: async (_parent, { id, todo: patch }, ctx) => {
      if (ctx.id && ctx.role) {
        try {
          const ownedRow = await TodoCollection.findOne({ userId: ctx.id });
          if (ownedRow) {
            const refreshed = await TodoCollection.findByIdAndUpdate(
              id,
              { $set: patch },
              { new: true, runValidators: true },
            );
            return refreshed;
          } else {
            throw new GraphQLError("you're not allowed to update this todo");
          }
        } catch (err) {
          throw new GraphQLError(err.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
    deleteTodo: async (_parent, { id }, ctx) => {
      if (ctx.id && ctx.role) {
        try {
          const todo = await TodoCollection.findOne({ userId: ctx.id });
          if (todo) {
            await TodoCollection.findByIdAndDelete(id);
            return "Todo deleted successsfully";
          } else {
            throw new GraphQLError("you're not allowed to delete this todo");
          }
        } catch (err) {
          throw new GraphQLError(err.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
    updateUser: async (_parent, { id, user: patch }, ctx) => {
      if (ctx.id && ctx.role) {
        try {
          const refreshed = await UserCollection.findByIdAndUpdate(
            id,
            { $set: patch },
            { new: true, runValidators: true },
          );
          return refreshed;
        } catch (err) {
          throw new GraphQLError(err.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
    deleteUser: async (_parent, { id }, ctx) => {
      if (ctx.id && ctx.role) {
        try {
          await TodoCollection.deleteMany({ userId: id });
          await UserCollection.findByIdAndDelete(id);
          return "User removed ok";
        } catch (err) {
          throw new GraphQLError(err.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
  },
  User: {
    todos: async (userRow) => {
      const nestedTodos = await TodoCollection.find({ userId: userRow._id });
      return nestedTodos;
    },
  },
  Todo: {
    user: async (todoRow) => {
      const owner = await UserCollection.findOne({ _id: todoRow.userId });
      return owner;
    },
  },
};
