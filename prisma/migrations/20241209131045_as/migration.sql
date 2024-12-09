/*
  Warnings:

  - You are about to drop the column `cashBoxId` on the `Receipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "cashBoxId",
ADD COLUMN     "TransactionAccountId" TEXT;
