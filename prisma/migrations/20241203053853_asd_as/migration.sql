-- CreateTable
CREATE TABLE "DatabaseConnection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "connectionUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatabaseConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DatabaseConnection_name_key" ON "DatabaseConnection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DatabaseConnection_connectionUrl_key" ON "DatabaseConnection"("connectionUrl");
