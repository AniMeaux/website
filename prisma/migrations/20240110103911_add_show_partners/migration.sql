-- CreateTable
CREATE TABLE "ShowPartner" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ShowPartner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowPartner_name_key" ON "ShowPartner"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShowPartner_url_key" ON "ShowPartner"("url");
