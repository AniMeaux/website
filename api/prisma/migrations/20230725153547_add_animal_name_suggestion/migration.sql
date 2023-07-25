-- CreateTable
CREATE TABLE "AnimalNameSuggestion" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "gender" "Gender",

    CONSTRAINT "AnimalNameSuggestion_pkey" PRIMARY KEY ("name")
);
