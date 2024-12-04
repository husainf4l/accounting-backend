/*
  Warnings:

  - Added the required column `displayName` to the `EmployeeDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeeDetails" ADD COLUMN     "displayName" TEXT NOT NULL;
