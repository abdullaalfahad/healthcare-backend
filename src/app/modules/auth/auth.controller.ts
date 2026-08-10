import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { AuthService } from "./auth.service";

const patientRegister = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const data = await AuthService.patientRegister({ name, email, password });

  tokenUtils.setCookieAccessToken(res, data.accessToken);
  tokenUtils.setCookieRefreshToken(res, data.refreshToken);
  tokenUtils.setCookieSessionToken(res, data.token as string);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data,
  });
});

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const data = await AuthService.userLogin({ email, password });

  tokenUtils.setCookieAccessToken(res, data.accessToken);
  tokenUtils.setCookieRefreshToken(res, data.refreshToken);
  tokenUtils.setCookieSessionToken(res, data.token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = await AuthService.getMe(user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User fetched successfully",
    data,
  });
});

export const AuthController = {
  patientRegister,
  userLogin,
  getMe,
};
