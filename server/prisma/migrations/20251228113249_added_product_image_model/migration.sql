/*
  Warnings:

  - Made the column `publicId` on table `FeaturedBanner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `FeaturedBanner` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."FeaturedBanner" ALTER COLUMN "publicId" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL;
