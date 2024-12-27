/*
  Warnings:

  - A unique constraint covering the columns `[taxId,companyId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_taxId_companyId_key" ON "Customer"("taxId", "companyId");
