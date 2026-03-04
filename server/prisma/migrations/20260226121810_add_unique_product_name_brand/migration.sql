/*
  Warnings:

  - A unique constraint covering the columns `[name,brandId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_name_brandId_key" ON "public"."Product"("name", "brandId");
