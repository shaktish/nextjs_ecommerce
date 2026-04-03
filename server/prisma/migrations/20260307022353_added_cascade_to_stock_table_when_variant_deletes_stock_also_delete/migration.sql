-- DropForeignKey
ALTER TABLE "public"."Stock" DROP CONSTRAINT "Stock_variantId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Stock" ADD CONSTRAINT "Stock_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
