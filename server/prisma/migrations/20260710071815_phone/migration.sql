/*
  Warnings:

  - Made the column `phone` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Address" ALTER COLUMN "phone" SET NOT NULL;
