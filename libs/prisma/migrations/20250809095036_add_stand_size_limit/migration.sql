-- CreateTable
CREATE TABLE "ShowStandSizeLimit" (
    "size" "ShowStandSize" NOT NULL,
    "maxCount" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowStandSizeLimit_size_key" ON "ShowStandSizeLimit"("size");
