-- CreateTable
CREATE TABLE "ShowProvider" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ShowProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowProvider_name_key" ON "ShowProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShowProvider_url_key" ON "ShowProvider"("url");
