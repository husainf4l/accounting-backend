/*
  Warnings:

  - The values [TRADEEXPENSES] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Lease` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE', 'CONTRA_ASSET');
ALTER TABLE "Account" ALTER COLUMN "accountType" TYPE "AccountType_new" USING ("accountType"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "AccountType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Lease" DROP CONSTRAINT "Lease_accountId_fkey";

-- DropTable
DROP TABLE "Lease";
