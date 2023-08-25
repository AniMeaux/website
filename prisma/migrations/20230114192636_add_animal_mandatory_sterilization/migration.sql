-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "isSterilizationMandatory" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "AnimalDraft" ADD COLUMN     "isSterilizationMandatory" BOOLEAN;
