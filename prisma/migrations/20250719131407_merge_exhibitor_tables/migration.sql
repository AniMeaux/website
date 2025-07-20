/*
  Warnings:

  - You are about to drop the column `exhibitorId` on the `ShowExhibitorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `dogsConfigurationId` on the `ShowExhibitorDog` table. All the data in the column will be lost.
  - You are about to drop the `ShowExhibitorDocuments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowExhibitorDogsConfiguration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowExhibitorProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowExhibitorStandConfiguration` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[applicationId]` on the table `ShowExhibitor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationId` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folderId` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoPath` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tableCount` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exhibitorId` to the `ShowExhibitorDog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShowExhibitorStatus" AS ENUM ('TO_BE_FILLED', 'AWAITING_VALIDATION', 'TO_MODIFY', 'VALIDATED');

-- CreateEnum
CREATE TYPE "ShowDividerType" AS ENUM ('GRID', 'FABRIC_PANEL', 'WOOD_PANEL');

-- CreateEnum
CREATE TYPE "ShowInstallationDay" AS ENUM ('FRIDAY', 'SATURDAY');

-- DropForeignKey
ALTER TABLE "ShowExhibitorApplication" DROP CONSTRAINT "ShowExhibitorApplication_exhibitorId_fkey";

-- DropForeignKey
ALTER TABLE "ShowExhibitorDocuments" DROP CONSTRAINT "ShowExhibitorDocuments_exhibitorId_fkey";

-- DropForeignKey
ALTER TABLE "ShowExhibitorDog" DROP CONSTRAINT "ShowExhibitorDog_dogsConfigurationId_fkey";

-- DropForeignKey
ALTER TABLE "ShowExhibitorDogsConfiguration" DROP CONSTRAINT "ShowExhibitorDogsConfiguration_exhibitorId_fkey";

-- DropForeignKey
ALTER TABLE "ShowExhibitorProfile" DROP CONSTRAINT "ShowExhibitorProfile_exhibitorId_fkey";

-- DropForeignKey
ALTER TABLE "ShowExhibitorStandConfiguration" DROP CONSTRAINT "ShowExhibitorStandConfiguration_exhibitorId_fkey";

-- DropIndex
DROP INDEX "ShowExhibitorApplication_exhibitorId_key";

-- AlterTable
ALTER TABLE "ShowExhibitor" ADD COLUMN     "activityFields" "ShowActivityField"[],
ADD COLUMN     "activityTargets" "ShowActivityTarget"[],
ADD COLUMN     "applicationId" UUID NOT NULL,
ADD COLUMN     "chairCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "description" VARCHAR(512),
ADD COLUMN     "descriptionStatus" "ShowExhibitorStatus" NOT NULL DEFAULT 'TO_BE_FILLED',
ADD COLUMN     "descriptionStatusMessage" TEXT,
ADD COLUMN     "dividerCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dividerType" "ShowDividerType",
ADD COLUMN     "documentStatus" "ShowExhibitorStatus" NOT NULL DEFAULT 'TO_BE_FILLED',
ADD COLUMN     "documentStatusMessage" TEXT,
ADD COLUMN     "dogsConfigurationStatus" "ShowExhibitorStatus" NOT NULL DEFAULT 'TO_BE_FILLED',
ADD COLUMN     "dogsConfigurationStatusMessage" TEXT,
ADD COLUMN     "folderId" VARCHAR(128) NOT NULL,
ADD COLUMN     "hasElectricalConnection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasTablecloths" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "identificationFileId" VARCHAR(128),
ADD COLUMN     "installationDay" "ShowInstallationDay",
ADD COLUMN     "insuranceFileId" VARCHAR(128),
ADD COLUMN     "kbisFileId" VARCHAR(128),
ADD COLUMN     "links" TEXT[],
ADD COLUMN     "locationNumber" VARCHAR(16),
ADD COLUMN     "logoPath" VARCHAR(128) NOT NULL,
ADD COLUMN     "name" VARCHAR(64) NOT NULL,
ADD COLUMN     "onStandAnimations" VARCHAR(256),
ADD COLUMN     "onStandAnimationsStatus" "ShowExhibitorStatus" NOT NULL DEFAULT 'TO_BE_FILLED',
ADD COLUMN     "onStandAnimationsStatusMessage" TEXT,
ADD COLUMN     "peopleCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "placementComment" VARCHAR(256),
ADD COLUMN     "publicProfileStatus" "ShowExhibitorStatus" NOT NULL DEFAULT 'TO_BE_FILLED',
ADD COLUMN     "publicProfileStatusMessage" TEXT,
ADD COLUMN     "size" "ShowStandSize" NOT NULL,
ADD COLUMN     "standConfigurationStatus" "ShowExhibitorStatus" NOT NULL DEFAULT 'TO_BE_FILLED',
ADD COLUMN     "standConfigurationStatusMessage" TEXT,
ADD COLUMN     "standNumber" VARCHAR(16),
ADD COLUMN     "tableCount" INTEGER NOT NULL,
ADD COLUMN     "zone" "ShowStandZone";

-- AlterTable
ALTER TABLE "ShowExhibitorApplication" DROP COLUMN "exhibitorId";

-- AlterTable
ALTER TABLE "ShowExhibitorDog" DROP COLUMN "dogsConfigurationId",
ADD COLUMN     "exhibitorId" UUID NOT NULL;

-- DropTable
DROP TABLE "ShowExhibitorDocuments";

-- DropTable
DROP TABLE "ShowExhibitorDogsConfiguration";

-- DropTable
DROP TABLE "ShowExhibitorProfile";

-- DropTable
DROP TABLE "ShowExhibitorStandConfiguration";

-- DropEnum
DROP TYPE "ShowExhibitorDocumentsStatus";

-- DropEnum
DROP TYPE "ShowExhibitorDogsConfigurationStatus";

-- DropEnum
DROP TYPE "ShowExhibitorProfileStatus";

-- DropEnum
DROP TYPE "ShowExhibitorStandConfigurationDividerType";

-- DropEnum
DROP TYPE "ShowExhibitorStandConfigurationInstallationDay";

-- DropEnum
DROP TYPE "ShowExhibitorStandConfigurationStatus";

-- CreateIndex
CREATE UNIQUE INDEX "ShowExhibitor_applicationId_key" ON "ShowExhibitor"("applicationId");

-- AddForeignKey
ALTER TABLE "ShowExhibitor" ADD CONSTRAINT "ShowExhibitor_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "ShowExhibitorApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowExhibitorDog" ADD CONSTRAINT "ShowExhibitorDog_exhibitorId_fkey" FOREIGN KEY ("exhibitorId") REFERENCES "ShowExhibitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
