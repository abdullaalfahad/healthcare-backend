import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { ZodError } from 'zod';
import { envVariables } from '../config/env';
import AppError from '../errorHelpers/appError';
import { handleZodHelpers } from '../errorHelpers/handleZodHelpers';
import { IErrorResponse, IErrorSource } from '../interface/error.interface';

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let errorSource: IErrorSource[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = 'Internal server error';
  const stack: string | undefined = error.stack;

  if (error instanceof ZodError) {
    const simplifiedErrors = handleZodHelpers(error);
    errorSource = simplifiedErrors.errorSource;
    statusCode = simplifiedErrors.statusCode;
    message = simplifiedErrors.message;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorSource = [{ path: '', message: error.message }];
    message = error.message;
  } else if (error instanceof Error) {
    errorSource = [{ path: '', message: error.message }];
    message = error.message;
  }

  const response: IErrorResponse = {
    success: false,
    message: message,
    errorSource: errorSource,
    error: envVariables.NODE_ENV === 'development' ? error : undefined,
    stack: envVariables.NODE_ENV === 'development' ? stack : undefined,
  };

  res.status(statusCode).json(response);
};
