-- AlterTable
ALTER TABLE "ShowExhibitor" ADD COLUMN     "hasPaid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ShowExhibitorApplication" ADD COLUMN     "structureActivityTargets" "ShowActivityTarget"[];
