-- CreateTable
CREATE TABLE "_UserCompanies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserCompanies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserCompanies_B_index" ON "_UserCompanies"("B");

-- AddForeignKey
ALTER TABLE "_UserCompanies" ADD CONSTRAINT "_UserCompanies_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCompanies" ADD CONSTRAINT "_UserCompanies_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
