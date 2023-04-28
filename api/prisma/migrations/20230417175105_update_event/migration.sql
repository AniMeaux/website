/*
  Warnings:

  - You are about to drop the column `category` on the `Event` table. All the data in the column will be lost.
  - Made the column `image` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "category",
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "isVisible" SET DEFAULT true;

-- DropEnum
DROP TYPE "EventCategory";
