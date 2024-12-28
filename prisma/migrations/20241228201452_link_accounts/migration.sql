/*
  Warnings:

  - You are about to drop the column `buyerId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the `Buyer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seller` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_sellerId_fkey";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "buyerId",
DROP COLUMN "sellerId";

-- DropTable
DROP TABLE "Buyer";

-- DropTable
DROP TABLE "Seller";

-- CreateTable
CREATE TABLE "LinkedAccount" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkedAccount_companyId_role_key" ON "LinkedAccount"("companyId", "role");

-- AddForeignKey
ALTER TABLE "LinkedAccount" ADD CONSTRAINT "LinkedAccount_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedAccount" ADD CONSTRAINT "LinkedAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
