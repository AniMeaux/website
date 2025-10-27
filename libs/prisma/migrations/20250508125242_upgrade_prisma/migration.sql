-- AlterTable
ALTER TABLE "_ShowAnimationToShowExhibitor" ADD CONSTRAINT "_ShowAnimationToShowExhibitor_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ShowAnimationToShowExhibitor_AB_unique";
