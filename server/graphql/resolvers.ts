import { IStorage } from "../storage";
import { GraphQLError } from "graphql";
import { GraphQLScalarType, Kind } from "graphql";

interface Context {
  user: any;
  storage: IStorage;
  isAuthenticated: boolean;
}

// Define a custom scalar for DateTime
const dateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "DateTime scalar type",
  serialize(value) {
    return value instanceof Date ? value.toISOString() : null;
  },
  parseValue(value) {
    return value ? new Date(value) : null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const resolvers = {
  DateTime: dateTimeScalar,

  Query: {
    me: (_: any, __: any, { user, isAuthenticated }: Context) => {
      if (!isAuthenticated) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      return user;
    },
    users: async (_: any, __: any, { user, isAuthenticated, storage }: Context) => {
      if (!isAuthenticated) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      if (user.role !== "admin") {
        throw new GraphQLError("Not authorized", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      return await storage.getAllUsers();
    },
    user: async (_: any, { id }: { id: string }, { user, isAuthenticated, storage }: Context) => {
      if (!isAuthenticated) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      if (user.role !== "admin" && user.id !== parseInt(id)) {
        throw new GraphQLError("Not authorized", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      return await storage.getUser(parseInt(id));
    },
  },

  Mutation: {
    register: async (_: any, { input }: any, { storage }: Context) => {
      try {
        const existingUser = await storage.getUserByEmail(input.email);
        if (existingUser) {
          throw new GraphQLError("Email already in use", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        
        const user = await storage.createUser(input);
        return user;
      } catch (error) {
        throw new GraphQLError(error.message || "Registration failed", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    login: async (_: any, { input }: any, { storage }: Context) => {
      try {
        const user = await storage.getUserByEmail(input.email);
        if (!user) {
          throw new GraphQLError("Invalid email or password", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const isValid = await storage.comparePasswords(input.password, user.password);
        if (!isValid) {
          throw new GraphQLError("Invalid email or password", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        // Generate 2FA code
        const code = await storage.generateTwoFactorCode(user.email);
        
        // In a real app, we'd send this via email
        console.log(`2FA Code for ${user.email}: ${code}`);

        return {
          message: "Verification code sent to your email",
          requiresTwoFactor: true,
          email: user.email,
        };
      } catch (error) {
        throw new GraphQLError(error.message || "Login failed", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    verifyTwoFactor: async (_: any, { input }: any, { storage }: Context) => {
      try {
        const isValid = await storage.verifyTwoFactorCode(input.email, input.code);
        
        if (!isValid) {
          throw new GraphQLError("Invalid or expired verification code", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        
        const user = await storage.getUserByEmail(input.email);
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        
        return user;
      } catch (error) {
        throw new GraphQLError(error.message || "Verification failed", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    forgotPassword: async (_: any, { input }: any, { storage }: Context) => {
      try {
        const token = await storage.generateResetToken(input.email);
        
        if (token) {
          // In a real app, we'd send the reset link via email
          console.log(`Password reset token for ${input.email}: ${token}`);
        }
        
        // Don't reveal whether the email exists or not
        return "If your email is registered, you will receive a password reset link";
      } catch (error) {
        throw new GraphQLError("Failed to process request", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    resetPassword: async (_: any, { input }: any, { storage }: Context) => {
      try {
        const user = await storage.verifyResetToken(input.token);
        
        if (!user) {
          throw new GraphQLError("Invalid or expired token", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        
        await storage.changePassword(user.id, input.password);
        
        return "Password reset successful";
      } catch (error) {
        throw new GraphQLError(error.message || "Failed to reset password", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    logout: () => {
      return true;
    },

    createUser: async (_: any, { input }: any, { user, isAuthenticated, storage }: Context) => {
      if (!isAuthenticated) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      if (user.role !== "admin") {
        throw new GraphQLError("Not authorized", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      try {
        const existingUser = await storage.getUserByEmail(input.email);
        if (existingUser) {
          throw new GraphQLError("Email already in use", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        
        return await storage.createUser(input);
      } catch (error) {
        throw new GraphQLError(error.message || "Failed to create user", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    updateUser: async (_: any, { id, input }: any, { user, isAuthenticated, storage }: Context) => {
      if (!isAuthenticated) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      if (user.role !== "admin" && user.id !== parseInt(id)) {
        throw new GraphQLError("Not authorized", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      try {
        const updatedUser = await storage.updateUser(parseInt(id), input);
        if (!updatedUser) {
          throw new GraphQLError("User not found", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        return updatedUser;
      } catch (error) {
        throw new GraphQLError(error.message || "Failed to update user", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    deleteUser: async (_: any, { id }: any, { user, isAuthenticated, storage }: Context) => {
      if (!isAuthenticated) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      if (user.role !== "admin") {
        throw new GraphQLError("Not authorized", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      try {
        await storage.deleteUser(parseInt(id));
        return true;
      } catch (error) {
        throw new GraphQLError(error.message || "Failed to delete user", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
};
