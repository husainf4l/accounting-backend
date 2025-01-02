/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `JournalEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_number_key" ON "JournalEntry"("number");
