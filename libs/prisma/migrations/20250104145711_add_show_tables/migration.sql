-- CreateEnum
CREATE TYPE "ShowPartnershipCategory" AS ENUM ('BRONZE', 'SILVER', 'GOLD');

-- CreateEnum
CREATE TYPE "ShowExhibitorApplicationStatus" AS ENUM ('UNTREATED', 'REFUSED', 'VALIDATED', 'WAITING_LIST');

-- CreateEnum
CREATE TYPE "ShowExhibitorApplicationOtherPartnershipCategory" AS ENUM ('MAYBE', 'NO_PARTNERSHIP');

-- CreateEnum
CREATE TYPE "ShowExhibitorApplicationLegalStatus" AS ENUM ('ASSOCIATION', 'SOLE_PROPRIETORSHIP', 'COMPANY');

-- CreateEnum
CREATE TYPE "ShowExhibitorDocumentsStatus" AS ENUM ('TO_BE_FILLED', 'AWAITING_VALIDATION', 'TO_MODIFY', 'VALIDATED');

-- CreateEnum
CREATE TYPE "ShowExhibitorStandConfigurationStatus" AS ENUM ('TO_BE_FILLED', 'AWAITING_VALIDATION', 'TO_MODIFY', 'VALIDATED');

-- CreateEnum
CREATE TYPE "ShowExhibitorStandConfigurationDividerType" AS ENUM ('GRID', 'FABRIC_PANEL', 'WOOD_PANEL');

-- CreateEnum
CREATE TYPE "ShowExhibitorStandConfigurationInstallationDay" AS ENUM ('FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "ShowStandZone" AS ENUM ('INSIDE', 'OUTSIDE');

-- CreateEnum
CREATE TYPE "ShowActivityField" AS ENUM ('ACCESSORIES', 'ALTERNATIVE_MEDICINE', 'ARTIST', 'ASSOCIATION', 'BEHAVIOR', 'CARE', 'CITY', 'DRAWING', 'EDITING', 'EDUCATION', 'FOOD', 'PHOTOGRAPHER', 'SENSITIZATION', 'SERVICES', 'TRAINING');

-- CreateEnum
CREATE TYPE "ShowActivityTarget" AS ENUM ('CATS', 'DOGS', 'EQUINES', 'HUMANS', 'NACS', 'RABBITS', 'WILDLIFE');

-- CreateEnum
CREATE TYPE "ShowStandSize" AS ENUM ('S_6', 'S_9', 'S_12', 'S_18', 'S_36');

-- AlterEnum
ALTER TYPE "UserGroup" ADD VALUE 'SHOW_ORGANIZER';

-- CreateTable
CREATE TABLE "ShowProvider" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "logoPath" VARCHAR(128) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "url" VARCHAR(128) NOT NULL,

    CONSTRAINT "ShowProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowPartner" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "category" "ShowPartnershipCategory" NOT NULL,
    "exhibitorId" UUID,
    "logoPath" VARCHAR(128),
    "name" VARCHAR(64),
    "url" VARCHAR(128),

    CONSTRAINT "ShowPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowAnimation" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "description" VARCHAR(128) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "registrationUrl" VARCHAR(128),
    "startTime" TIMESTAMP(3) NOT NULL,
    "zone" "ShowStandZone" NOT NULL,

    CONSTRAINT "ShowAnimation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowExhibitor" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "token" UUID NOT NULL,
    "hasPaid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ShowExhibitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowExhibitorApplication" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exhibitorId" UUID,
    "status" "ShowExhibitorApplicationStatus" NOT NULL DEFAULT 'UNTREATED',
    "refusalMessage" VARCHAR(512),
    "contactLastname" VARCHAR(64) NOT NULL,
    "contactFirstname" VARCHAR(64) NOT NULL,
    "contactEmail" VARCHAR(64) NOT NULL,
    "contactPhone" VARCHAR(64) NOT NULL,
    "structureName" VARCHAR(64) NOT NULL,
    "structureUrl" VARCHAR(128) NOT NULL,
    "structureLegalStatus" "ShowExhibitorApplicationLegalStatus",
    "structureOtherLegalStatus" VARCHAR(64),
    "structureSiret" VARCHAR(128) NOT NULL,
    "structureActivityTargets" "ShowActivityTarget"[],
    "structureActivityFields" "ShowActivityField"[],
    "structureAddress" VARCHAR(128) NOT NULL,
    "structureZipCode" VARCHAR(64) NOT NULL,
    "structureCity" VARCHAR(128) NOT NULL,
    "structureCountry" VARCHAR(64) NOT NULL,
    "structureLogoPath" VARCHAR(128) NOT NULL,
    "billingAddress" VARCHAR(128) NOT NULL,
    "billingCity" VARCHAR(128) NOT NULL,
    "billingZipCode" VARCHAR(64) NOT NULL,
    "billingCountry" VARCHAR(64) NOT NULL,
    "desiredStandSize" "ShowStandSize" NOT NULL,
    "proposalForOnStageEntertainment" VARCHAR(512),
    "partnershipCategory" "ShowPartnershipCategory",
    "otherPartnershipCategory" "ShowExhibitorApplicationOtherPartnershipCategory",
    "discoverySource" VARCHAR(128) NOT NULL,

    CONSTRAINT "ShowExhibitorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowExhibitorDocuments" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exhibitorId" UUID NOT NULL,
    "status" "ShowExhibitorDocumentsStatus" NOT NULL DEFAULT 'TO_BE_FILLED',
    "statusMessage" VARCHAR(512),
    "folderId" VARCHAR(128) NOT NULL,
    "identificationFileId" VARCHAR(128),
    "insuranceFileId" VARCHAR(128),
    "kbisFileId" VARCHAR(128),

    CONSTRAINT "ShowExhibitorDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowExhibitorProfile" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exhibitorId" UUID NOT NULL,
    "activityFields" "ShowActivityField"[],
    "activityTargets" "ShowActivityTarget"[],
    "description" VARCHAR(256),
    "links" TEXT[],
    "logoPath" VARCHAR(128) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "onStandAnimations" VARCHAR(128),

    CONSTRAINT "ShowExhibitorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowExhibitorStandConfiguration" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exhibitorId" UUID NOT NULL,
    "status" "ShowExhibitorStandConfigurationStatus" NOT NULL DEFAULT 'TO_BE_FILLED',
    "statusMessage" VARCHAR(512),
    "chairCount" INTEGER NOT NULL DEFAULT 1,
    "dividerCount" INTEGER NOT NULL DEFAULT 0,
    "dividerType" "ShowExhibitorStandConfigurationDividerType",
    "hasTablecloths" BOOLEAN NOT NULL DEFAULT true,
    "installationDay" "ShowExhibitorStandConfigurationInstallationDay",
    "locationNumber" INTEGER,
    "peopleCount" INTEGER NOT NULL DEFAULT 1,
    "placementComment" VARCHAR(256),
    "size" "ShowStandSize" NOT NULL,
    "standNumber" INTEGER,
    "tableCount" INTEGER NOT NULL,
    "zone" "ShowStandZone",

    CONSTRAINT "ShowExhibitorStandConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowExhibitorDog" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "standConfigurationId" UUID NOT NULL,
    "gender" "Gender" NOT NULL,
    "idNumber" VARCHAR(64) NOT NULL,
    "isCategorized" BOOLEAN NOT NULL,
    "isSterilized" BOOLEAN NOT NULL,

    CONSTRAINT "ShowExhibitorDog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ShowAnimationToShowExhibitor" (
    "A" VARCHAR(255) NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowProvider_logoPath_key" ON "ShowProvider"("logoPath");

-- CreateIndex
CREATE UNIQUE INDEX "ShowProvider_name_key" ON "ShowProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShowProvider_url_key" ON "ShowProvider"("url");

-- CreateIndex
CREATE UNIQUE INDEX "ShowPartner_exhibitorId_key" ON "ShowPartner"("exhibitorId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowPartner_logoPath_key" ON "ShowPartner"("logoPath");

-- CreateIndex
CREATE UNIQUE INDEX "ShowPartner_name_key" ON "ShowPartner"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShowPartner_url_key" ON "ShowPartner"("url");

-- CreateIndex
CREATE UNIQUE INDEX "ShowExhibitor_token_key" ON "ShowExhibitor"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ShowExhibitorApplication_exhibitorId_key" ON "ShowExhibitorApplication"("exhibitorId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowExhibitorApplication_contactEmail_key" ON "ShowExhibitorApplication"("contactEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ShowExhibitorDocuments_exhibitorId_key" ON "ShowExhibitorDocuments"("exhibitorId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowExhibitorProfile_exhibitorId_key" ON "ShowExhibitorProfile"("exhibitorId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowExhibitorStandConfiguration_exhibitorId_key" ON "ShowExhibitorStandConfiguration"("exhibitorId");

-- CreateIndex
CREATE UNIQUE INDEX "_ShowAnimationToShowExhibitor_AB_unique" ON "_ShowAnimationToShowExhibitor"("A", "B");

-- CreateIndex
CREATE INDEX "_ShowAnimationToShowExhibitor_B_index" ON "_ShowAnimationToShowExhibitor"("B");

-- AddForeignKey
ALTER TABLE "ShowPartner" ADD CONSTRAINT "ShowPartner_exhibitorId_fkey" FOREIGN KEY ("exhibitorId") REFERENCES "ShowExhibitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowExhibitorApplication" ADD CONSTRAINT "ShowExhibitorApplication_exhibitorId_fkey" FOREIGN KEY ("exhibitorId") REFERENCES "ShowExhibitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowExhibitorDocuments" ADD CONSTRAINT "ShowExhibitorDocuments_exhibitorId_fkey" FOREIGN KEY ("exhibitorId") REFERENCES "ShowExhibitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowExhibitorProfile" ADD CONSTRAINT "ShowExhibitorProfile_exhibitorId_fkey" FOREIGN KEY ("exhibitorId") REFERENCES "ShowExhibitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowExhibitorStandConfiguration" ADD CONSTRAINT "ShowExhibitorStandConfiguration_exhibitorId_fkey" FOREIGN KEY ("exhibitorId") REFERENCES "ShowExhibitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowExhibitorDog" ADD CONSTRAINT "ShowExhibitorDog_standConfigurationId_fkey" FOREIGN KEY ("standConfigurationId") REFERENCES "ShowExhibitorStandConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShowAnimationToShowExhibitor" ADD CONSTRAINT "_ShowAnimationToShowExhibitor_A_fkey" FOREIGN KEY ("A") REFERENCES "ShowAnimation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShowAnimationToShowExhibitor" ADD CONSTRAINT "_ShowAnimationToShowExhibitor_B_fkey" FOREIGN KEY ("B") REFERENCES "ShowExhibitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
