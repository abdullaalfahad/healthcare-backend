import status from "http-status";
import AppError from "../../errorHelpers/appError";
import { prisma } from "../../lib/prisma";
import { IUpdateAdminPayload } from "./admin.interface";

const getAllAdmins = async () => {
  const admins = await prisma.admin.findMany();
  return admins;
};

const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id },
  });
  return admin;
};

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  const { admin } = payload;
  const updatedAdmin = await prisma.admin.update({
    where: { id },
    data: {
      name: admin.name,
      profilePhoto: admin.profilePhoto,
      contactNumber: admin.contactNumber,
    },
  });
  return updatedAdmin;
};

export const deleteAdmin = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id },
  });
  if (!admin) {
    throw new AppError("Admin not found", status.NOT_FOUND);
  }
  try {
    const deletedAdmin = await prisma.$transaction(async (tx) => {
      const admin = await tx.admin.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: admin.userId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      return admin;
    });

    return deletedAdmin;
  } catch (error: any) {
    throw new AppError(error.message, status.INTERNAL_SERVER_ERROR);
  }
};

export const adminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
