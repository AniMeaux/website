/*
  Warnings:

  - Added the required column `structureActivityDescription` to the `ShowExhibitorApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowExhibitorApplication" ADD COLUMN     "structureActivityDescription" VARCHAR(300) NOT NULL;
