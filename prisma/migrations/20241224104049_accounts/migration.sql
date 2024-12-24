/*
  Warnings:

  - Added the required column `nameAr` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "ifrcClassification" TEXT,
ADD COLUMN     "level" INTEGER,
ADD COLUMN     "nameAr" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileImage" SET DEFAULT 'https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2Fshared%2Fdownload.jpeg?alt=media&';
