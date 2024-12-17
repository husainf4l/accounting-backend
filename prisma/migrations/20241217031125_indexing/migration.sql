-- CreateIndex
CREATE INDEX "Account_companyId_idx" ON "Account"("companyId");

-- CreateIndex
CREATE INDEX "Account_companyId_hierarchyCode_idx" ON "Account"("companyId", "hierarchyCode");

-- CreateIndex
CREATE INDEX "Cheque_companyId_idx" ON "Cheque"("companyId");

-- CreateIndex
CREATE INDEX "Customer_companyId_idx" ON "Customer"("companyId");

-- CreateIndex
CREATE INDEX "GeneralLedger_companyId_idx" ON "GeneralLedger"("companyId");

-- CreateIndex
CREATE INDEX "GeneralLedger_companyId_accountId_idx" ON "GeneralLedger"("companyId", "accountId");

-- CreateIndex
CREATE INDEX "Invoice_companyId_idx" ON "Invoice"("companyId");

-- CreateIndex
CREATE INDEX "InvoiceItem_companyId_idx" ON "InvoiceItem"("companyId");

-- CreateIndex
CREATE INDEX "JournalEntry_companyId_idx" ON "JournalEntry"("companyId");

-- CreateIndex
CREATE INDEX "Product_companyId_idx" ON "Product"("companyId");

-- CreateIndex
CREATE INDEX "Receipt_companyId_idx" ON "Receipt"("companyId");

-- CreateIndex
CREATE INDEX "Transaction_companyId_idx" ON "Transaction"("companyId");

-- CreateIndex
CREATE INDEX "Transaction_companyId_createdAt_idx" ON "Transaction"("companyId", "createdAt");
