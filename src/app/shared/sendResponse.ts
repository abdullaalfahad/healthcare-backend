import { Response } from 'express';

type SendResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

export const sendResponse = <T>(
  res: Response,
  { statusCode, success, message, data }: SendResponse<T>
): void => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};
