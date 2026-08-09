import { Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { envVariables } from '../config/env';
import { jwtUtils } from './jwt';

const getAccessToken = (payload: JwtPayload) => {
  const token = jwtUtils.generateToken(payload, envVariables.JWT_SECRET, {
    expiresIn: '1d',
  });
  return token;
};

const getRefreshToken = (payload: JwtPayload) => {
  const token = jwtUtils.generateToken(payload, envVariables.JWT_SECRET, {
    expiresIn: '7d',
  });
  return token;
};

const setCookieAccessToken = (res: Response, token: string) => {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });
};

const setCookieRefreshToken = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

const setCookieSessionToken = (res: Response, token: string) => {
  res.cookie('better-auth.session_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setCookieAccessToken,
  setCookieRefreshToken,
  setCookieSessionToken,
};
