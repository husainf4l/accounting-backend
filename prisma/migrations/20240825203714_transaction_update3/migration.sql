/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `recurring` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Bill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "createdBy",
DROP COLUMN "recurring",
DROP COLUMN "updatedBy";
