-- CreateEnum
CREATE TYPE "ActivityActorType" AS ENUM ('CRON', 'USER');

-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('CREATE', 'DELETE', 'UPDATE');

-- CreateEnum
CREATE TYPE "ActivityResource" AS ENUM ('ANIMAL', 'FOSTER_FAMILY');

-- CreateTable
CREATE TABLE "Activity" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "actorType" "ActivityActorType" NOT NULL,
    "actorId" VARCHAR(255) NOT NULL,
    "userIdRef" VARCHAR(255),
    "action" "ActivityAction" NOT NULL,
    "resource" "ActivityResource" NOT NULL,
    "resourceId" VARCHAR(255) NOT NULL,
    "animalId" VARCHAR(255),
    "fosterFamilyId" VARCHAR(255),
    "before" JSONB,
    "after" JSONB,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userIdRef_fkey" FOREIGN KEY ("userIdRef") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_fosterFamilyId_fkey" FOREIGN KEY ("fosterFamilyId") REFERENCES "FosterFamily"("id") ON DELETE SET NULL ON UPDATE CASCADE;
