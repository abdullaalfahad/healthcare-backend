import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { cookieUtils } from "../../utils/cookie";
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

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const sessionToken = req.cookies["better-auth.session_token"];

  const data = await AuthService.refreshToken(refreshToken, sessionToken);

  tokenUtils.setCookieAccessToken(res, data.accessToken);
  tokenUtils.setCookieRefreshToken(res, data.refreshToken);
  tokenUtils.setCookieSessionToken(res, data.sessionToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "New token generated successfully",
    data,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session_token"];

  const data = await AuthService.changePassword(req.body, sessionToken);

  tokenUtils.setCookieAccessToken(res, data.accessToken);
  tokenUtils.setCookieRefreshToken(res, data.refreshToken);
  tokenUtils.setCookieSessionToken(res, data.token as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await AuthService.verifyEmail(email, otp);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Email verified successfully",
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session_token"];
  await AuthService.logout(sessionToken);

  cookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  cookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  cookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged out successfully",
  });
});

export const AuthController = {
  patientRegister,
  userLogin,
  getMe,
  refreshToken,
  changePassword,
  verifyEmail,
  logout,
};
