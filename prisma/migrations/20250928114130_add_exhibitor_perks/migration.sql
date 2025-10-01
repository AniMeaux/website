-- AlterTable
ALTER TABLE "ShowExhibitor" ADD COLUMN     "breakfastPeopleCountSaturday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "breakfastPeopleCountSunday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "perksStatus" "ShowExhibitorStatus" NOT NULL DEFAULT 'TO_BE_FILLED',
ADD COLUMN     "perksStatusMessage" TEXT;
