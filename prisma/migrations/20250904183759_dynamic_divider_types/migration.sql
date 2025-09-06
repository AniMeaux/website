/*
  Warnings:

  - You are about to drop the column `dividerType` on the `ShowExhibitor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShowExhibitor" DROP COLUMN "dividerType",
ADD COLUMN     "dividerTypeId" UUID;

-- DropEnum
DROP TYPE "ShowDividerType";

-- CreateTable
CREATE TABLE "ShowDividerType" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" VARCHAR(128) NOT NULL,
    "maxCount" INTEGER NOT NULL,

    CONSTRAINT "ShowDividerType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowDividerType_label_key" ON "ShowDividerType"("label");

-- AddForeignKey
ALTER TABLE "ShowExhibitor" ADD CONSTRAINT "ShowExhibitor_dividerTypeId_fkey" FOREIGN KEY ("dividerTypeId") REFERENCES "ShowDividerType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
