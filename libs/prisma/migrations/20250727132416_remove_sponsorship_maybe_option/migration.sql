/*
  Warnings:

  - You are about to drop the column `otherSponsorshipCategory` on the `ShowExhibitorApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShowExhibitorApplication" DROP COLUMN "otherSponsorshipCategory";

-- DropEnum
DROP TYPE "ShowExhibitorApplicationOtherSponsorshipCategory";
