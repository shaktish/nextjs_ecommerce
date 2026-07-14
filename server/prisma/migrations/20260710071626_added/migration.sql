-- DropIndex
DROP INDEX "public"."Address_userId_idx";

-- AlterTable
ALTER TABLE "public"."Address" ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE INDEX "Address_id_userId_idx" ON "public"."Address"("id", "userId");
