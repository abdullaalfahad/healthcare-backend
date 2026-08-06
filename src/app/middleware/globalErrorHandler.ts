import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode: number = status.INTERNAL_SERVER_ERROR;
  const message: string = 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: message,
    error: error.message,
  });
};
