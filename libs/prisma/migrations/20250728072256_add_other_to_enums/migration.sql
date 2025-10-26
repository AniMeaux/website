/*
  Warnings:

  - You are about to drop the column `structureOtherLegalStatus` on the `ShowExhibitorApplication` table. All the data in the column will be lost.
  - Made the column `structureLegalStatus` on table `ShowExhibitorApplication` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `discoverySource` on the `ShowExhibitorApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShowExhibitorApplicationDiscoverySource" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'OTHER', 'PRESS', 'PREVIOUS_PARTICIPANT', 'SEARCH_ENGINE', 'WORD_OF_MOUTH');

-- AlterEnum
ALTER TYPE "ShowExhibitorApplicationLegalStatus" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "ShowExhibitorApplication" DROP COLUMN "structureOtherLegalStatus",
ADD COLUMN     "discoverySourceOther" VARCHAR(128),
ADD COLUMN     "structureLegalStatusOther" VARCHAR(64),
ALTER COLUMN "structureLegalStatus" SET NOT NULL,
DROP COLUMN "discoverySource",
ADD COLUMN     "discoverySource" "ShowExhibitorApplicationDiscoverySource" NOT NULL;
