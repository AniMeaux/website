/*
  Warnings:

  - You are about to alter the column `proposalForOnStageEntertainment` on the `ShowExhibitorApplication` table. The data in that column could be lost. The data in that column will be cast from `VarChar(512)` to `VarChar(500)`.
  - You are about to alter the column `comments` on the `ShowExhibitorApplication` table. The data in that column could be lost. The data in that column will be cast from `VarChar(512)` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "ShowExhibitorApplication" ALTER COLUMN "proposalForOnStageEntertainment" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "comments" SET DATA TYPE VARCHAR(500);
