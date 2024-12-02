/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `GeneralLedger` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GeneralLedger_accountId_key" ON "GeneralLedger"("accountId");
