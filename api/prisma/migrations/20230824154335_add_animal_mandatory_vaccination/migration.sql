-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "isVaccinationMandatory" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "AnimalDraft" ADD COLUMN     "isVaccinationMandatory" BOOLEAN;
