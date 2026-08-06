-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "doctors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePicture" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "experience" INTEGER,
    "currentWorkingPlace" TEXT,
    "registrationNumber" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "appointmentFee" DOUBLE PRECISION NOT NULL,
    "qualifications" TEXT,
    "designation" TEXT,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_specialities" (
    "id" TEXT NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "specialityId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_specialities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_registrationNumber_key" ON "doctors"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- CreateIndex
CREATE INDEX "idx_doctor_email" ON "doctors"("email");

-- CreateIndex
CREATE INDEX "idx_doctor_is_deleted" ON "doctors"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_is_deleted" ON "doctor_specialities"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_doctor_id" ON "doctor_specialities"("doctorId");

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_speciality_id" ON "doctor_specialities"("specialityId");

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialities" ADD CONSTRAINT "doctor_specialities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialities" ADD CONSTRAINT "doctor_specialities_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
