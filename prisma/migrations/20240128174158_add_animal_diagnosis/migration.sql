-- CreateEnum
CREATE TYPE "Diagnosis" AS ENUM ('CATEGORIZED', 'NOT_APPLICABLE', 'UNCATEGORIZED', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "diagnosis" "Diagnosis" NOT NULL DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "AnimalDraft" ADD COLUMN     "diagnosis" "Diagnosis" DEFAULT 'UNKNOWN';
