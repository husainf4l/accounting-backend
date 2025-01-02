/*
  Warnings:

  - A unique constraint covering the columns `[companyId,number]` on the table `JournalEntry` will be added. If there are existing duplicate values, this will fail.
  - Made the column `number` on table `JournalEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "JournalEntry_number_key";

-- AlterTable
ALTER TABLE "JournalEntry" ALTER COLUMN "number" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_companyId_number_key" ON "JournalEntry"("companyId", "number");
