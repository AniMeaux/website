/*
  Warnings:

  - You are about to drop the column `otherPartnershipCategory` on the `ShowExhibitorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `partnershipCategory` on the `ShowExhibitorApplication` table. All the data in the column will be lost.
  - You are about to drop the `ShowPartner` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ShowExhibitorApplicationOtherSponsorshipCategory" AS ENUM ('MAYBE', 'NO_SPONSORSHIP');

-- CreateEnum
CREATE TYPE "ShowSponsorshipCategory" AS ENUM ('POLLEN', 'BRONZE', 'SILVER', 'GOLD');

-- DropForeignKey
ALTER TABLE "ShowPartner" DROP CONSTRAINT "ShowPartner_exhibitorId_fkey";

-- AlterTable
ALTER TABLE "ShowExhibitorApplication" DROP COLUMN "otherPartnershipCategory",
DROP COLUMN "partnershipCategory",
ADD COLUMN     "otherSponsorshipCategory" "ShowExhibitorApplicationOtherSponsorshipCategory",
ADD COLUMN     "sponsorshipCategory" "ShowSponsorshipCategory";

-- DropTable
DROP TABLE "ShowPartner";

-- DropEnum
DROP TYPE "ShowExhibitorApplicationOtherPartnershipCategory";

-- DropEnum
DROP TYPE "ShowPartnershipCategory";

-- CreateTable
CREATE TABLE "ShowSponsor" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "category" "ShowSponsorshipCategory" NOT NULL,
    "exhibitorId" UUID,
    "logoPath" VARCHAR(128),
    "name" VARCHAR(64),
    "url" VARCHAR(128),

    CONSTRAINT "ShowSponsor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowSponsor_exhibitorId_key" ON "ShowSponsor"("exhibitorId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowSponsor_logoPath_key" ON "ShowSponsor"("logoPath");

-- CreateIndex
CREATE UNIQUE INDEX "ShowSponsor_name_key" ON "ShowSponsor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShowSponsor_url_key" ON "ShowSponsor"("url");

-- AddForeignKey
ALTER TABLE "ShowSponsor" ADD CONSTRAINT "ShowSponsor_exhibitorId_fkey" FOREIGN KEY ("exhibitorId") REFERENCES "ShowExhibitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
