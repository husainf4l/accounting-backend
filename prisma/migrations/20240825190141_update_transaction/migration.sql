-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "exchangeRate" DROP NOT NULL,
ALTER COLUMN "recurring" DROP NOT NULL;
