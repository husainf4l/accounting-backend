/*
  Warnings:

  - You are about to drop the column `einvoiceKey` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `einvoiceSecret` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taxNumber]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "einvoiceKey",
DROP COLUMN "einvoiceSecret",
ADD COLUMN     "eInvoiceClientId" TEXT,
ADD COLUMN     "eInvoiceSecretKey" TEXT,
ADD COLUMN     "legalName" TEXT,
ALTER COLUMN "taxNumber" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_taxNumber_key" ON "Company"("taxNumber");
