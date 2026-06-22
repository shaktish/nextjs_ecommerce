/*
  Warnings:

  - A unique constraint covering the columns `[redirectUrl]` on the table `FeaturedBanner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `redirectUrl` to the `FeaturedBanner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."FeaturedBanner" ADD COLUMN     "redirectUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedBanner_redirectUrl_key" ON "public"."FeaturedBanner"("redirectUrl");
