/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `ProductImage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductImage_publicId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_url_key" ON "ProductImage"("url");
