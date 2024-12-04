-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_accountManagerId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "accountManagerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_accountManagerId_fkey" FOREIGN KEY ("accountManagerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
