-- CreateEnum
CREATE TYPE "ScreeningResult" AS ENUM ('NEGATIVE', 'POSITIVE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "screeningFelv" "ScreeningResult" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "screeningFiv" "ScreeningResult" NOT NULL DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "AnimalDraft" ADD COLUMN     "screeningFelv" "ScreeningResult",
ADD COLUMN     "screeningFiv" "ScreeningResult";
