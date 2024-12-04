/*
  Warnings:

  - You are about to drop the column `clientDetailsId` on the `Invoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientDetailsId_fkey";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "clientDetailsId";
