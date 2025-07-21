/*
  Warnings:

  - You are about to drop the column `billingAddress` on the `ShowExhibitorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `billingCity` on the `ShowExhibitorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `billingCountry` on the `ShowExhibitorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `billingZipCode` on the `ShowExhibitorApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShowExhibitorApplication" DROP COLUMN "billingAddress",
DROP COLUMN "billingCity",
DROP COLUMN "billingCountry",
DROP COLUMN "billingZipCode";
