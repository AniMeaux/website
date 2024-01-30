-- CreateEnum
CREATE TYPE "FosterFamilyHousing" AS ENUM ('FLAT', 'HOUSE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "FosterFamilyGarden" AS ENUM ('NO', 'UNKNOWN', 'YES');

-- AlterTable
ALTER TABLE "FosterFamily" ADD COLUMN     "garden" "FosterFamilyGarden" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "housing" "FosterFamilyHousing" NOT NULL DEFAULT 'UNKNOWN';
