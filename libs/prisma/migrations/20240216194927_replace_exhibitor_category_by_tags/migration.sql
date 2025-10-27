/*
  Warnings:

  - You are about to drop the column `category` on the `Exhibitor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ExhibitorTag" AS ENUM ('DOGS', 'ACCESSORIES', 'ALTERNATIVE_MEDICINE', 'ARTIST', 'ASSOCIATION', 'BEHAVIOR', 'CARE', 'CATS', 'CITY', 'DRAWING', 'EDITING', 'EDUCATION', 'FOOD', 'HUMANS', 'NACS', 'PHOTOGRAPHER', 'RABBITS', 'SENSITIZATION', 'SERVICES', 'TRAINING', 'WILDLIFE');

-- AlterTable
ALTER TABLE "Exhibitor" DROP COLUMN "category",
ADD COLUMN     "tags" "ExhibitorTag"[];

-- DropEnum
DROP TYPE "ExhibitorCategory";
