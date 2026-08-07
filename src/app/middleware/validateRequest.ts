import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';

export const validateRequest = (zodSchema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = zodSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return next(parsedBody.error);
    }

    req.body = parsedBody.data;
    next();
  };
};
