import dotenv from 'dotenv';
import status from 'http-status';
import AppError from '../errorHelpers/appError';

dotenv.config();

interface EnvVariables {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  JWT_SECRET: string;
  ACCESS_TOKEN_EXPIRATION: string;
  REFRESH_TOKEN_EXPIRATION: string;
}

const loadEnvVariables = (): EnvVariables => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'JWT_SECRET',
    'ACCESS_TOKEN_EXPIRATION',
    'REFRESH_TOKEN_EXPIRATION',
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new AppError(
        `Missing required environment variable: ${varName}`,
        status.INTERNAL_SERVER_ERROR
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 5000,
    DATABASE_URL: process.env.DATABASE_URL || '',
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION || '1d',
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
  };
};

export const envVariables = loadEnvVariables();
