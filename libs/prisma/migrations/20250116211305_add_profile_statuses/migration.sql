-- CreateEnum
CREATE TYPE "ShowExhibitorProfileStatus" AS ENUM ('NOT_TOUCHED', 'AWAITING_VALIDATION', 'TO_MODIFY', 'VALIDATED');

-- AlterTable
ALTER TABLE "ShowExhibitorProfile" ADD COLUMN     "descriptionStatus" "ShowExhibitorProfileStatus" NOT NULL DEFAULT 'NOT_TOUCHED',
ADD COLUMN     "descriptionStatusMessage" VARCHAR(512),
ADD COLUMN     "onStandAnimationsStatus" "ShowExhibitorProfileStatus" NOT NULL DEFAULT 'NOT_TOUCHED',
ADD COLUMN     "onStandAnimationsStatusMessage" VARCHAR(512),
ADD COLUMN     "publicProfileStatus" "ShowExhibitorProfileStatus" NOT NULL DEFAULT 'NOT_TOUCHED',
ADD COLUMN     "publicProfileStatusMessage" VARCHAR(512);
