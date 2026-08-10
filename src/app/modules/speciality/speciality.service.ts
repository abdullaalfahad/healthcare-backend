import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllSpecialities = async () => {
  const specialities = await prisma.specialty.findMany();
  return specialities;
};

const createSpeciality = async (payload: Specialty) => {
  const speciality = await prisma.specialty.create({
    data: payload,
  });
  return speciality;
};

const deleteSpecility = async (id: string) => {
  const speciality = await prisma.specialty.delete({
    where: { id },
  });
  return speciality;
};

export const specialityService = {
  getAllSpecialities,
  deleteSpecility,
  createSpeciality,
};
