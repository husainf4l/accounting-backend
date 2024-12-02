/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `Account` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Account_accountNumber_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "accountNumber";
