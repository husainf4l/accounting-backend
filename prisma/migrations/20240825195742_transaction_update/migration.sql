/*
  Warnings:

  - You are about to drop the column `createdAt` on the `TaxCode` table. All the data in the column will be lost.
  - You are about to drop the column `taxType` on the `TaxCode` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TaxCode` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ExchangeRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExchangeRate" DROP CONSTRAINT "ExchangeRate_companyId_fkey";

-- AlterTable
ALTER TABLE "ExchangeRate" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "companyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TaxCode" DROP COLUMN "createdAt",
DROP COLUMN "taxType",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "ExchangeRate" ADD CONSTRAINT "ExchangeRate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
