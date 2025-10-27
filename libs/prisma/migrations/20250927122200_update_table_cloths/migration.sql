/*
  Warnings:

  - You are about to drop the column `hasTablecloths` on the `ShowExhibitor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShowExhibitor" DROP COLUMN "hasTablecloths",
ADD COLUMN     "hasTableCloths" BOOLEAN NOT NULL DEFAULT false;
