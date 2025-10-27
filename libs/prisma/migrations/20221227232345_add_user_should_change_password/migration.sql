-- AlterTable
ALTER TABLE "User" ADD COLUMN     "shouldChangePassword" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ALTER COLUMN "shouldChangePassword" SET DEFAULT true;
