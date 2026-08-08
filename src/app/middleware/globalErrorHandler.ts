import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { ZodError } from 'zod';
import { envVariables } from '../config/env';
import { handleZodHelpers } from '../helpers/handleZodHelpers';
import { IErrorSource } from '../interface/error.interface';

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

  if (error instanceof ZodError) {
    const simplifiedErrors = handleZodHelpers(error);
    errorSource = simplifiedErrors.errorSource;
    statusCode = simplifiedErrors.statusCode;
    message = simplifiedErrors.message;
  }

  const response = {
    success: false,
    message: message,
    errorSource: errorSource,
    error: envVariables.NODE_ENV === 'development' ? error : undefined,
  };

  res.status(statusCode).json(response);
};
