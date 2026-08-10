/*
  Warnings:

  - The primary key for the `doctors` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "doctor_specialities" DROP CONSTRAINT "doctor_specialities_doctorId_fkey";

-- AlterTable
ALTER TABLE "doctor_specialities" ALTER COLUMN "doctorId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "doctors_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "doctors_id_seq";

-- AddForeignKey
ALTER TABLE "doctor_specialities" ADD CONSTRAINT "doctor_specialities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
