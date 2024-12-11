/*
  Warnings:

  - You are about to drop the column `qrCode` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "einvoiceKey" TEXT,
ADD COLUMN     "einvoiceSecret" TEXT,
ADD COLUMN     "whatsAppKey" TEXT;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "qrCode";
