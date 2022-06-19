-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "familyAsChildrenId" TEXT;

-- CreateTable
CREATE TABLE "AnimalFamily" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimalFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnimalFamilyParent" (
    "A" VARCHAR(255) NOT NULL,
    "B" VARCHAR(255) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AnimalFamilyParent_AB_unique" ON "_AnimalFamilyParent"("A", "B");

-- CreateIndex
CREATE INDEX "_AnimalFamilyParent_B_index" ON "_AnimalFamilyParent"("B");

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_familyAsChildrenId_fkey" FOREIGN KEY ("familyAsChildrenId") REFERENCES "AnimalFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimalFamilyParent" ADD CONSTRAINT "_AnimalFamilyParent_A_fkey" FOREIGN KEY ("A") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimalFamilyParent" ADD CONSTRAINT "_AnimalFamilyParent_B_fkey" FOREIGN KEY ("B") REFERENCES "AnimalFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;
