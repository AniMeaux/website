/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `ShowExhibitor` will be added. If there are existing duplicate values, this will fail.
  - The required column `token` was added to the `ShowExhibitor` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "ShowExhibitor" ADD COLUMN     "token" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShowExhibitor_token_key" ON "ShowExhibitor"("token");
