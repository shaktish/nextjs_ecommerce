/*
  Warnings:

  - You are about to drop the column `genderId` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the `Sizes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId,sizeId]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `genderId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductVariant" DROP CONSTRAINT "ProductVariant_genderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductVariant" DROP CONSTRAINT "ProductVariant_sizeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Sizes" DROP CONSTRAINT "Sizes_genderId_fkey";

-- DropIndex
DROP INDEX "public"."ProductVariant_productId_genderId_sizeId_key";

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "genderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductVariant" DROP COLUMN "genderId";

-- DropTable
DROP TABLE "public"."Sizes";

-- CreateTable
CREATE TABLE "public"."Size" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Size_slug_key" ON "public"."Size"("slug");

-- CreateIndex
CREATE INDEX "Product_genderId_idx" ON "public"."Product"("genderId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_sizeId_key" ON "public"."ProductVariant"("productId", "sizeId");

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "public"."Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "public"."Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
