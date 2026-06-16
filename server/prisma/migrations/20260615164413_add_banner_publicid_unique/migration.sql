/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `FeaturedBanner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FeaturedBanner_publicId_key" ON "FeaturedBanner"("publicId");
