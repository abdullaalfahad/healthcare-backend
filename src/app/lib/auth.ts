import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { sendEmail } from "../utils/email";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    emailVerification: {
      enabled: true,
      sendVerificationEmail: true,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: Role.PATIENT,
        required: true,
        input: true,
      },
      status: {
        type: "string",
        defaultValue: UserStatus.ACTIVE,
        required: true,
        input: false,
      },
      needPasswordChange: {
        type: "boolean",
        defaultValue: false,
        required: true,
        input: true,
      },
      isDeleted: {
        type: "boolean",
        defaultValue: false,
        required: true,
        input: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  plugins: [
    bearer(),

    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (!user) {
            console.error(`User with this email ${email} not found`);
            return;
          }

          await sendEmail({
            to: email,
            subject: "Verify your email",
            templateName: "email-verification",
            templateData: {
              name: user.name,
              otp,
            },
          });
        }
      },
      expiresIn: 2 * 60, // 2 minutes
      otpLength: 6,
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24, // 1 day
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24, // 1 day
    },
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
  },
});
