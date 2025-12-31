/*
  Warnings:

  - Added the required column `sortOrder` to the `FeaturedBanner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."FeaturedBanner" ADD COLUMN     "sortOrder" INTEGER NOT NULL;
