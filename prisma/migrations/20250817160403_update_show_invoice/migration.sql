/*
  Warnings:

  - You are about to drop the column `issueDate` on the `ShowInvoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `ShowInvoice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShowInvoice_exhibitorId_key";

-- AlterTable
ALTER TABLE "ShowInvoice" DROP COLUMN "issueDate";

-- CreateIndex
CREATE UNIQUE INDEX "ShowInvoice_number_key" ON "ShowInvoice"("number");
