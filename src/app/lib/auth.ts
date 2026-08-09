import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { Role, UserStatus } from '../../generated/prisma/enums';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },

  users: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: Role.PATIENT,
        required: true,
      },
      status: {
        type: 'string',
        defaultValue: UserStatus.ACTIVE,
        required: true,
      },
      needPasswordChange: {
        type: 'boolean',
        defaultValue: false,
        required: true,
      },
      isDeleted: {
        type: 'boolean',
        defaultValue: false,
        required: true,
      },
      deletedAt: {
        type: 'date',
        required: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24, // 1 day
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24, // 1 day
    },
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
  },
});
