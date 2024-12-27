/*
  Warnings:

  - You are about to drop the column `postalCode` on the `Customer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Customer_accountId_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "postalCode",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "accountId" DROP NOT NULL;
