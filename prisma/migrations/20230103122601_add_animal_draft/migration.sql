-- CreateTable
CREATE TABLE "AnimalDraft" (
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255),
    "alias" VARCHAR(255),
    "birthdate" TIMESTAMP(3),
    "gender" "Gender",
    "species" "Species",
    "breedId" TEXT,
    "colorId" TEXT,
    "description" TEXT,
    "pickUpDate" TIMESTAMP(3),
    "pickUpLocation" TEXT,
    "pickUpReason" "PickUpReason",
    "status" "Status",
    "adoptionDate" TIMESTAMP(3),
    "adoptionOption" "AdoptionOption",
    "managerId" TEXT,
    "fosterFamilyId" TEXT,
    "iCadNumber" TEXT,
    "comments" TEXT,
    "isOkChildren" BOOLEAN,
    "isOkDogs" BOOLEAN,
    "isOkCats" BOOLEAN,
    "isSterilized" BOOLEAN
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimalDraft_ownerId_key" ON "AnimalDraft"("ownerId");

-- AddForeignKey
ALTER TABLE "AnimalDraft" ADD CONSTRAINT "AnimalDraft_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalDraft" ADD CONSTRAINT "AnimalDraft_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalDraft" ADD CONSTRAINT "AnimalDraft_fosterFamilyId_fkey" FOREIGN KEY ("fosterFamilyId") REFERENCES "FosterFamily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalDraft" ADD CONSTRAINT "AnimalDraft_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalDraft" ADD CONSTRAINT "AnimalDraft_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;
