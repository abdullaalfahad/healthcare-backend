import { NextFunction, Request, Response } from 'express';

type asyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync = (fn: asyncHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };
};
