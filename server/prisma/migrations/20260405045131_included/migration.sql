/*
  Warnings:

  - A unique constraint covering the columns `[name,brandId,categoryId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Product_name_brandId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_brandId_categoryId_key" ON "public"."Product"("name", "brandId", "categoryId");
