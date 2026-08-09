import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const generateToken = (payload: JwtPayload, secret: string, { expiresIn }: SignOptions) => {
  const token = jwt.sign(payload, secret, { expiresIn: expiresIn });
  return token;
};

const verifyToken = (token: string, secret: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Token decoding failed:', error);
    return null;
  }
};

export const jwtUtils = {
  generateToken,
  verifyToken,
  decodeToken,
};
