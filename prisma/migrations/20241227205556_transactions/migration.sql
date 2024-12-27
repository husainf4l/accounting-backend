/*
  Warnings:

  - You are about to drop the column `customerId` on the `BankDetails` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankDetails" DROP CONSTRAINT "BankDetails_customerId_fkey";

-- AlterTable
ALTER TABLE "BankDetails" DROP COLUMN "customerId";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "customerId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
