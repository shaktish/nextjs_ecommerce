/*
  Warnings:

  - Made the column `name` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Address" ALTER COLUMN "name" SET NOT NULL;
