/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentReference` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "paymentMethod",
DROP COLUMN "paymentReference";

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "paymentMethod" "public"."PaymentMethod";
