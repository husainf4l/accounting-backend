/*
  Warnings:

  - You are about to alter the column `quantity` on the `PurchaseInvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `unitPrice` on the `PurchaseInvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `discountAmount` on the `PurchaseInvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `lineExtensionAmount` on the `PurchaseInvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `taxAmount` on the `PurchaseInvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `taxPercent` on the `PurchaseInvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Added the required column `totalAmount` to the `PurchaseInvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseInvoiceItem" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "taxDetails" JSONB,
ADD COLUMN     "totalAmount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "unitOfMeasure" TEXT,
ADD COLUMN     "updatedBy" TEXT,
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "unitPrice" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "discountAmount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "lineExtensionAmount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "taxAmount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "taxPercent" SET DATA TYPE DECIMAL(65,30);
