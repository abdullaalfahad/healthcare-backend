import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { doctorService } from "./doctor.service";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const resullts = await doctorService.getAllDoctors();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Doctors fetched successfully",
    data: resullts,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.getDoctorById(id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Doctor fetched successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await doctorService.updateDoctor(id as string, payload);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Doctor updated successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.deleteDoctor(id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Doctor deleted successfully",
    data: result,
  });
});

export const doctorController = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
