import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
  },

  session: {
    // 1day in seconds
    expiresIn: 60 * 60 * 60 * 24,
    // 1day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24,
    },
  },

  // add additional Field
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        default: Role.PATIENT,
      },
      status: {
        type: "string",
        required: false,
        default: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: false,
        default: false,
      },
      isDeleted: {
        type: "boolean",
        required: false,
        default: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        default: null,
      },
    },
  },
});
