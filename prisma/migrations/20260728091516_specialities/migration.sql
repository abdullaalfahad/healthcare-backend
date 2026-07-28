/*
  Warnings:

  - You are about to drop the `Speciality` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Speciality";

-- CreateTable
CREATE TABLE "specialities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specialities_title_key" ON "specialities"("title");

-- CreateIndex
CREATE INDEX "idx_speciality_is_deleted" ON "specialities"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_speciality_title" ON "specialities"("title");
