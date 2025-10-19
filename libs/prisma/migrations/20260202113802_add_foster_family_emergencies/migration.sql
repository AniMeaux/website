-- CreateEnum
CREATE TYPE "FosterFamilyEmergencies" AS ENUM ('NO', 'YES', 'UNKNOWN');

-- AlterTable
ALTER TABLE "FosterFamily" ADD COLUMN     "emergencies" "FosterFamilyEmergencies" NOT NULL DEFAULT 'UNKNOWN';
