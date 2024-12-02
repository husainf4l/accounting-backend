/*
  Warnings:

  - You are about to drop the column `subType` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "subType";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
ADD COLUMN     "credit" DOUBLE PRECISION,
ADD COLUMN     "debit" DOUBLE PRECISION;
