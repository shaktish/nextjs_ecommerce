/*
  Warnings:

  - Added the required column `isLeaf` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Category"
ADD COLUMN "isLeaf" BOOLEAN,
ADD COLUMN "level" INTEGER;

UPDATE "public"."Category"
SET level = 1
WHERE "parentId" IS NULL;

UPDATE "public"."Category"
SET level = 2
WHERE "parentId" IS NOT NULL;

UPDATE "public"."Category" c
SET "isLeaf" = NOT EXISTS (
  SELECT 1
  FROM "public"."Category" child
  WHERE child."parentId" = c.id
);

-- Step 3: enforce NOT NULL
ALTER TABLE "public"."Category"
ALTER COLUMN "level" SET NOT NULL,
ALTER COLUMN "isLeaf" SET NOT NULL;
