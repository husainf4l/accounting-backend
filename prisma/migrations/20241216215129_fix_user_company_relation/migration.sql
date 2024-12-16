/*
  Warnings:

  - Added the required column `companyId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `AdditionalDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `BillingReference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Cheque` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `EINV` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `GeneralLedger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Lease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Obligation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `WarehouseStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AdditionalDocument" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BankDetails" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BillingReference" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Buyer" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Cheque" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EINV" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GeneralLedger" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lease" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Obligation" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WarehouseStock" ADD COLUMN     "companyId" TEXT NOT NULL;
