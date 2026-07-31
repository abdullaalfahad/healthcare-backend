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

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const data = await AuthService.userLogin({ email, password });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data,
  });
});

export const AuthController = {
  patientRegister,
  userLogin,
};
