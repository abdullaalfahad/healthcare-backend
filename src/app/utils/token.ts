import { JwtPayload } from 'jsonwebtoken';
import { envVariables } from '../config/env';
import { jwtUtils } from './jwt';

const getAccessToken = (payload: JwtPayload) => {
  const token = jwtUtils.generateToken(payload, envVariables.JWT_SECRET, {
    expiresIn: envVariables.ACCESS_TOKEN_EXPIRATION,
  });
  return token;
};

const getRefreshToken = (payload: JwtPayload) => {
  const token = jwtUtils.generateToken(payload, envVariables.JWT_SECRET, {
    expiresIn: envVariables.REFRESH_TOKEN_EXPIRATION,
  });
  return token;
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
};
