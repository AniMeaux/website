-- AlterTable
ALTER TABLE "ShowExhibitorApplication" ALTER COLUMN "refusalMessage" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ShowExhibitorDocuments" ALTER COLUMN "statusMessage" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ShowExhibitorDogsConfiguration" ALTER COLUMN "statusMessage" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ShowExhibitorProfile" ALTER COLUMN "descriptionStatusMessage" SET DATA TYPE TEXT,
ALTER COLUMN "onStandAnimationsStatusMessage" SET DATA TYPE TEXT,
ALTER COLUMN "publicProfileStatusMessage" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ShowExhibitorStandConfiguration" ALTER COLUMN "statusMessage" SET DATA TYPE TEXT;
