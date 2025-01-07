/*
  Warnings:

  - You are about to drop the column `standConfigurationId` on the `ShowExhibitorDog` table. All the data in the column will be lost.
  - Added the required column `dogsConfigurationId` to the `ShowExhibitorDog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShowExhibitorDogsConfigurationStatus" AS ENUM ('NOT_TOUCHED', 'AWAITING_VALIDATION', 'TO_MODIFY', 'VALIDATED');

-- DropForeignKey
ALTER TABLE "ShowExhibitorDog" DROP CONSTRAINT "ShowExhibitorDog_standConfigurationId_fkey";

-- AlterTable
ALTER TABLE "ShowExhibitorDog" DROP COLUMN "standConfigurationId",
ADD COLUMN     "dogsConfigurationId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "ShowExhibitorDogsConfiguration" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exhibitorId" UUID NOT NULL,
    "status" "ShowExhibitorDogsConfigurationStatus" NOT NULL DEFAULT 'NOT_TOUCHED',
    "statusMessage" VARCHAR(512),

    CONSTRAINT "ShowExhibitorDogsConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowExhibitorDogsConfiguration_exhibitorId_key" ON "ShowExhibitorDogsConfiguration"("exhibitorId");

-- AddForeignKey
ALTER TABLE "ShowExhibitorDogsConfiguration" ADD CONSTRAINT "ShowExhibitorDogsConfiguration_exhibitorId_fkey" FOREIGN KEY ("exhibitorId") REFERENCES "ShowExhibitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowExhibitorDog" ADD CONSTRAINT "ShowExhibitorDog_dogsConfigurationId_fkey" FOREIGN KEY ("dogsConfigurationId") REFERENCES "ShowExhibitorDogsConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
