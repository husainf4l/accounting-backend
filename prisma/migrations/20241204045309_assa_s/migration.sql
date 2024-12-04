-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "clientDetailsId" TEXT;

-- CreateTable
CREATE TABLE "ClientDetails" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "taxNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeDetails" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "iban" TEXT,
    "swiftCode" TEXT,
    "branchName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientDetails_accountId_key" ON "ClientDetails"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeDetails_accountId_key" ON "EmployeeDetails"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_accountId_key" ON "BankDetails"("accountId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientDetailsId_fkey" FOREIGN KEY ("clientDetailsId") REFERENCES "ClientDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
