-- CreateTable
CREATE TABLE "PressArticle" (
    "id" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "publicationDate" TIMESTAMP(3) NOT NULL,
    "publisherName" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "PressArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PressArticle_url_key" ON "PressArticle"("url");
