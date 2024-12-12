/*
  Warnings:

  - A unique constraint covering the columns `[legalId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "legalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Company_legalId_key" ON "Company"("legalId");
