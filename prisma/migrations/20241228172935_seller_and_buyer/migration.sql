-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'SUBMITTED', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "currencyExchangeRate" DOUBLE PRECISION,
ALTER COLUMN "InvoiceTypeCodeName" SET DEFAULT '012';
