-- CreateEnum
CREATE TYPE "ShowInvoiceStatus" AS ENUM ('TO_PAY', 'PAID');

-- CreateTable
CREATE TABLE "ShowInvoice" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exhibitorId" UUID NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "number" VARCHAR(256) NOT NULL,
    "url" VARCHAR(128) NOT NULL,
    "status" "ShowInvoiceStatus" NOT NULL DEFAULT 'TO_PAY',

    CONSTRAINT "ShowInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowInvoice_exhibitorId_key" ON "ShowInvoice"("exhibitorId");

-- AddForeignKey
ALTER TABLE "ShowInvoice" ADD CONSTRAINT "ShowInvoice_exhibitorId_fkey" FOREIGN KEY ("exhibitorId") REFERENCES "ShowExhibitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
