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

const getAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const admin = await adminService.getAdminById(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin fetched successfully",
    data: admin,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const admin = await adminService.updateAdmin(id as string, payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin updated successfully",
    data: admin,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const admin = await adminService.deleteAdmin(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin deleted successfully",
    data: admin,
  });
});

export const adminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
