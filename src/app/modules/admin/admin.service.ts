import { prisma } from "../../lib/prisma";

const getAllAdmins = async () => {
  const admins = await prisma.admin.findMany();
  return admins;
};

export const adminService = {
  getAllAdmins,
};
