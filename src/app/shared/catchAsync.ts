import { NextFunction, Request, Response } from 'express';

type asyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync = (fn: asyncHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      res.status(500).json({
        success: false,
        status: 'error',
        message: (err as Error).message,
      });
    }
  };
};
