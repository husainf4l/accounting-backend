-- DropForeignKey
ALTER TABLE "GeneralLedger" DROP CONSTRAINT "GeneralLedger_accountId_fkey";

-- DropIndex
DROP INDEX "GeneralLedger_accountId_key";

-- AlterTable
ALTER TABLE "GeneralLedger" ADD COLUMN     "credit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "debit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "accountId" DROP NOT NULL,
ALTER COLUMN "balance" SET DEFAULT 0.0;

-- CreateIndex
CREATE INDEX "GeneralLedger_companyId_customerId_idx" ON "GeneralLedger"("companyId", "customerId");

-- CreateIndex
CREATE INDEX "GeneralLedger_customerId_date_idx" ON "GeneralLedger"("customerId", "date");

-- AddForeignKey
ALTER TABLE "GeneralLedger" ADD CONSTRAINT "GeneralLedger_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralLedger" ADD CONSTRAINT "GeneralLedger_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
