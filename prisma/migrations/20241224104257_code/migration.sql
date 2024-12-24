/*
  Warnings:

  - You are about to drop the column `hierarchyCode` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code,companyId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account_companyId_hierarchyCode_idx";

-- DropIndex
DROP INDEX "Account_hierarchyCode_companyId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "hierarchyCode",
ADD COLUMN     "code" TEXT NOT NULL,
ALTER COLUMN "nameAr" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Account_companyId_code_idx" ON "Account"("companyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Account_code_companyId_key" ON "Account"("code", "companyId");
