/*
  Warnings:

  - Added the required column `sortOrder` to the `Sizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Sizes" ADD COLUMN     "sortOrder" INTEGER NOT NULL;
