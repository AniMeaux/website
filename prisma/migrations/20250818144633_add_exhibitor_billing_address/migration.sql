/*
  Warnings:

  - Added the required column `billingAddress` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingCity` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingCountry` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingZipCode` to the `ShowExhibitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowExhibitor" ADD COLUMN     "billingAddress" VARCHAR(128) NOT NULL,
ADD COLUMN     "billingCity" VARCHAR(128) NOT NULL,
ADD COLUMN     "billingCountry" VARCHAR(64) NOT NULL,
ADD COLUMN     "billingZipCode" VARCHAR(64) NOT NULL;
