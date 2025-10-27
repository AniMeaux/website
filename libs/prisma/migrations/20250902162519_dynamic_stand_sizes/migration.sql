/*
  Warnings:

  - You are about to drop the column `size` on the `ShowExhibitor` table. All the data in the column will be lost.
  - You are about to drop the column `desiredStandSize` on the `ShowExhibitorApplication` table. All the data in the column will be lost.
  - You are about to drop the `ShowStandSizeLimit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sizeId` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desiredStandSizeId` to the `ShowExhibitorApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowExhibitor" DROP COLUMN "size",
ADD COLUMN     "sizeId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ShowExhibitorApplication" DROP COLUMN "desiredStandSize",
ADD COLUMN     "desiredStandSizeId" UUID NOT NULL;

-- DropTable
DROP TABLE "ShowStandSizeLimit";

-- DropEnum
DROP TYPE "ShowStandSize";

-- CreateTable
CREATE TABLE "ShowStandSize" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" VARCHAR(128) NOT NULL,
    "area" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isRestrictedByActivityField" BOOLEAN NOT NULL DEFAULT false,
    "maxCount" INTEGER NOT NULL,
    "maxTableCount" INTEGER NOT NULL,
    "maxPeopleCount" INTEGER NOT NULL,
    "maxDividerCount" INTEGER NOT NULL,

    CONSTRAINT "ShowStandSize_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowStandSize_label_key" ON "ShowStandSize"("label");

-- AddForeignKey
ALTER TABLE "ShowExhibitorApplication" ADD CONSTRAINT "ShowExhibitorApplication_desiredStandSizeId_fkey" FOREIGN KEY ("desiredStandSizeId") REFERENCES "ShowStandSize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowExhibitor" ADD CONSTRAINT "ShowExhibitor_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "ShowStandSize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
