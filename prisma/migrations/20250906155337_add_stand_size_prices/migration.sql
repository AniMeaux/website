/*
  Warnings:

  - Added the required column `priceForShops` to the `ShowStandSize` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowStandSize" ADD COLUMN     "priceForAssociations" INTEGER,
ADD COLUMN     "priceForServices" INTEGER,
ADD COLUMN     "priceForShops" INTEGER NOT NULL;
