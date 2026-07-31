import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { AuthService } from './auth.service';

const patientRegister = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const data = await AuthService.patientRegister({ name, email, password });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data,
  });
});

export const AuthController = {
  patientRegister,
};
