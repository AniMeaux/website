/*
  Warnings:

  - You are about to drop the column `isRestrictedByActivityField` on the `ShowStandSize` table. All the data in the column will be lost.
  - Added the required column `category` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShowExhibitorCategory" AS ENUM ('ASSOCIATION', 'SERVICE', 'SHOP');

-- AlterTable
ALTER TABLE "ShowExhibitor" ADD COLUMN     "category" "ShowExhibitorCategory" NOT NULL;

-- AlterTable
ALTER TABLE "ShowStandSize" DROP COLUMN "isRestrictedByActivityField",
ADD COLUMN     "priceForAssociations" INTEGER,
ADD COLUMN     "priceForServices" INTEGER,
ADD COLUMN     "priceForShops" INTEGER;
