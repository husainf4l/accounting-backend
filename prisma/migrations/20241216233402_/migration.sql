/*
  Warnings:

  - You are about to drop the column `schemeId` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hierarchyCode,companyId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Account_hierarchyCode_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "schemeId";

-- CreateIndex
CREATE UNIQUE INDEX "Account_hierarchyCode_companyId_key" ON "Account"("hierarchyCode", "companyId");
