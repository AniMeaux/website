-- AlterTable
ALTER TABLE "FosterFamily" ADD COLUMN     "comments" TEXT,
ADD COLUMN     "speciesAlreadyPresent" "Species"[] DEFAULT ARRAY[]::"Species"[],
ADD COLUMN     "speciesToHost" "Species"[] DEFAULT ARRAY[]::"Species"[];
