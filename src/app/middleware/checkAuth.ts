import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { UserStatus } from "../../generated/prisma/enums";
import { envVariables } from "../config/env";
import AppError from "../errorHelpers/appError";
import { prisma } from "../lib/prisma";
import { cookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";

export const checkAuth = (...authRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");

      if (!sessionToken) {
        throw new AppError("Unauthorized! Please login to continue", status.UNAUTHORIZED);
      }

      const sessionExists = await prisma.session.findUnique({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!sessionExists) {
        throw new AppError("Unauthorized! Please login to continue", status.UNAUTHORIZED);
      }

      if (sessionExists) {
        const user = sessionExists.user;
        const expiresAt = sessionExists.expiresAt;
        const createdAt = sessionExists.createdAt;
        const timePassed = new Date().getTime() - createdAt.getTime();
        const remainingTime = expiresAt.getTime() - new Date().getTime();
        const remainTimeInPercentage = (remainingTime / timePassed) * 100;

        if (remainTimeInPercentage < 10) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Session-Remaining-Time", remainingTime.toString());
        }

        if (user.status !== UserStatus.ACTIVE) {
          throw new AppError("Your account is not active", status.FORBIDDEN);
        }

        if (user.isDeleted) {
          throw new AppError("Your account is deleted", status.FORBIDDEN);
        }

        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new AppError("You are not authorized to access this resource", status.FORBIDDEN);
        }
      }

      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError("Unauthorized! Please login to continue", status.UNAUTHORIZED);
      }

      const verifiyToken = jwtUtils.verifyToken(accessToken, envVariables.JWT_SECRET);

      if (!verifiyToken) {
        throw new AppError("Unauthorized! Please login to continue", status.UNAUTHORIZED);
      }

      if (authRoles.length > 0 && !authRoles.includes(verifiyToken.role)) {
        throw new AppError("You are not authorized to access this resource", status.FORBIDDEN);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
