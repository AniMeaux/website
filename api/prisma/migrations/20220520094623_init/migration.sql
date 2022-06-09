-- CreateEnum
CREATE TYPE "UserGroup" AS ENUM ('ADMIN', 'ANIMAL_MANAGER', 'BLOGGER', 'HEAD_OF_PARTNERSHIPS', 'VETERINARIAN');

-- CreateEnum
CREATE TYPE "Species" AS ENUM ('BIRD', 'CAT', 'DOG', 'REPTILE', 'RODENT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE');

-- CreateEnum
CREATE TYPE "PickUpReason" AS ENUM ('ABANDONMENT', 'DECEASED_MASTER', 'MISTREATMENT', 'STRAY_ANIMAL', 'OTHER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ADOPTED', 'DECEASED', 'FREE', 'OPEN_TO_ADOPTION', 'OPEN_TO_RESERVATION', 'RESERVED', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "AdoptionOption" AS ENUM ('FREE_DONATION', 'UNKNOWN', 'WITH_STERILIZATION', 'WITHOUT_STERILIZATION');

-- CreateEnum
CREATE TYPE "AnimalAge" AS ENUM ('ADULT', 'JUNIOR', 'SENIOR');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('COLLECTION', 'SHOW', 'FORUM', 'SENSITIZATION', 'BIRTHDAY', 'ATHLETIC');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(255) NOT NULL,
    "legacyId" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "groups" "UserGroup"[],
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FosterFamily" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "zipCode" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,

    CONSTRAINT "FosterFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breed" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "species" "Species" NOT NULL,

    CONSTRAINT "Breed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "alias" VARCHAR(255),
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "species" "Species" NOT NULL,
    "breedId" TEXT,
    "colorId" TEXT,
    "description" TEXT,
    "avatar" TEXT NOT NULL,
    "pictures" TEXT[],
    "pickUpDate" TIMESTAMP(3) NOT NULL,
    "pickUpLocation" TEXT,
    "pickUpReason" "PickUpReason" NOT NULL DEFAULT E'OTHER',
    "status" "Status" NOT NULL,
    "adoptionDate" TIMESTAMP(3),
    "adoptionOption" "AdoptionOption",
    "managerId" TEXT,
    "fosterFamilyId" TEXT,
    "iCadNumber" TEXT,
    "comments" TEXT,
    "isOkChildren" BOOLEAN,
    "isOkDogs" BOOLEAN,
    "isOkCats" BOOLEAN,
    "isSterilized" BOOLEAN NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isFullDay" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_legacyId_key" ON "User"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FosterFamily_email_key" ON "FosterFamily"("email");

-- CreateIndex
CREATE INDEX "Breed_species_idx" ON "Breed"("species");

-- CreateIndex
CREATE UNIQUE INDEX "Breed_name_species_key" ON "Breed"("name", "species");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- CreateIndex
CREATE INDEX "Animal_species_idx" ON "Animal"("species");

-- CreateIndex
CREATE INDEX "Animal_status_idx" ON "Animal"("status");

-- CreateIndex
CREATE INDEX "Animal_managerId_idx" ON "Animal"("managerId");

-- CreateIndex
CREATE INDEX "Animal_status_species_idx" ON "Animal"("status", "species");

-- CreateIndex
CREATE INDEX "Animal_status_managerId_idx" ON "Animal"("status", "managerId");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_fosterFamilyId_fkey" FOREIGN KEY ("fosterFamilyId") REFERENCES "FosterFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
