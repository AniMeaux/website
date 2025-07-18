/*
  Warnings:

  - Added the required column `motivation` to the `ShowExhibitorApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowExhibitorApplication" ADD COLUMN     "motivation" VARCHAR(1000) NOT NULL;
