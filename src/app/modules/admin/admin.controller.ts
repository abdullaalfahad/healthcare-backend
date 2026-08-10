import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { adminService } from "./admin.service";

const getAllAdmins = catchAsync(async (req, res) => {
  const admins = await adminService.getAllAdmins();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admins fetched successfully",
    data: admins,
  });
});

export const adminController = {
  getAllAdmins,
};
