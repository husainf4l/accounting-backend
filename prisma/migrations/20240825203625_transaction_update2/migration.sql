/*
  Warnings:

  - Made the column `itemId` on table `BillLineItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BillLineItem" DROP CONSTRAINT "BillLineItem_itemId_fkey";

-- AlterTable
ALTER TABLE "BillLineItem" ALTER COLUMN "itemId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "BillLineItem" ADD CONSTRAINT "BillLineItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
