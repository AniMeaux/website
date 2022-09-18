/*
  Warnings:

  - You are about to drop the column `shortDescription` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "shortDescription",
ADD COLUMN     "url" TEXT;
