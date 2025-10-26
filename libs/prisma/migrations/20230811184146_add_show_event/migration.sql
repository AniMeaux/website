-- CreateTable
CREATE TABLE "ShowEvent" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "registrationUrl" TEXT,

    CONSTRAINT "ShowEvent_pkey" PRIMARY KEY ("id")
);
