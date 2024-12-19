-- CreateTable
CREATE TABLE "PurchaseInvoice" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "documentCurrency" TEXT NOT NULL DEFAULT 'JOD',
    "taxCurrency" TEXT NOT NULL DEFAULT 'JOD',
    "companyId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "taxExclusiveAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "taxInclusiveAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "allowanceTotalAmount" DOUBLE PRECISION,
    "payableAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "employeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "number" INTEGER NOT NULL,

    CONSTRAINT "PurchaseInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseInvoiceItem" (
    "id" TEXT NOT NULL,
    "purchaseInvoiceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT NOT NULL,
    "discountAmount" DOUBLE PRECISION,
    "lineExtensionAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "taxCategory" TEXT NOT NULL,
    "taxPercent" DOUBLE PRECISION NOT NULL,
    "productId" TEXT,

    CONSTRAINT "PurchaseInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseInvoice_uuid_key" ON "PurchaseInvoice"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseInvoice_number_key" ON "PurchaseInvoice"("number");

-- CreateIndex
CREATE INDEX "PurchaseInvoice_companyId_idx" ON "PurchaseInvoice"("companyId");

-- CreateIndex
CREATE INDEX "PurchaseInvoiceItem_companyId_idx" ON "PurchaseInvoiceItem"("companyId");

-- AddForeignKey
ALTER TABLE "PurchaseInvoiceItem" ADD CONSTRAINT "PurchaseInvoiceItem_purchaseInvoiceId_fkey" FOREIGN KEY ("purchaseInvoiceId") REFERENCES "PurchaseInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoiceItem" ADD CONSTRAINT "PurchaseInvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
