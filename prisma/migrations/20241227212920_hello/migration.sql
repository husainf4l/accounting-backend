-- DropIndex
DROP INDEX "GeneralLedger_companyId_accountId_idx";

-- DropIndex
DROP INDEX "GeneralLedger_companyId_customerId_idx";

-- DropIndex
DROP INDEX "GeneralLedger_customerId_date_idx";

-- AlterTable
ALTER TABLE "GeneralLedger" ADD COLUMN     "bankId" TEXT,
ADD COLUMN     "expenseId" TEXT,
ADD COLUMN     "supplierId" TEXT;

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "contact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GeneralLedger_accountId_idx" ON "GeneralLedger"("accountId");

-- CreateIndex
CREATE INDEX "GeneralLedger_customerId_idx" ON "GeneralLedger"("customerId");

-- AddForeignKey
ALTER TABLE "GeneralLedger" ADD CONSTRAINT "GeneralLedger_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralLedger" ADD CONSTRAINT "GeneralLedger_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "BankDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralLedger" ADD CONSTRAINT "GeneralLedger_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE SET NULL ON UPDATE CASCADE;
