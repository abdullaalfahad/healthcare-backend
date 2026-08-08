import status from 'http-status';
import { ZodError } from 'zod';
import { IErrorSource } from '../interface/error.interface';

export const handleZodHelpers = (error: ZodError) => {
  const errorSource: IErrorSource[] = error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
  return {
    message: 'Zod validation error',
    errorSource: errorSource,
    statusCode: status.BAD_REQUEST,
  };
};
