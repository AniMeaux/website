-- CreateEnum
CREATE TYPE "FosterFamilyAvailability" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "FosterFamily" ADD COLUMN     "availability" "FosterFamilyAvailability" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "availabilityExpirationDate" TIMESTAMP(3);
