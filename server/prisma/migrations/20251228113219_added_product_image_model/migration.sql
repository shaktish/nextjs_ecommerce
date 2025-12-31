/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `FeaturedBanner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."FeaturedBanner" DROP COLUMN "imageUrl",
ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "url" TEXT;
