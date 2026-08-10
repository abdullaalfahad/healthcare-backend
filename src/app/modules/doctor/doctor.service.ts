import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
  const doctor = await prisma.doctor.findMany();

  return doctor;
};

const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      specialities: true,
    },
  });

  return doctor;
};

export const doctorService = { getAllDoctors, getDoctorById };
