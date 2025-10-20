-- CreateEnum
CREATE TYPE "FosterFamilyEmergencies" AS ENUM ('NO', 'YES');

-- AlterTable
ALTER TABLE "FosterFamily" ADD COLUMN     "acceptsEmergencies" "FosterFamilyEmergencies" NOT NULL DEFAULT 'NO';
