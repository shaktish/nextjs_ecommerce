<!-- # Create and apply a new migration after changing schema.prisma
# This will:
# 1. Generate SQL migration files
# 2. Apply them to the database
# 3. Automatically run `prisma generate` -->
npx prisma migrate dev --name added-id-for-category

<!-- 
# Reset the database completely (development only)
# This will:
# 1. Drop the database
# 2. Recreate it
# 3. Re-run all migrations
# 4. Run the seed script if configured
# Useful when schema changes break existing data -->
npx prisma migrate reset 

<!-- Open Prisma Studio (Very Useful) -->
npx prisma studio

<!-- # Regenerate Prisma Client
# Required only when the schema changes WITHOUT running migrations
# (example: after `prisma db pull` or manual schema edits) -->
npx prisma generate  

<!-- Pull Schema From Existing DB -->
npx prisma db pull

<!-- 
# Seed Database 
Runs your seed script.
-->
npx prisma db seed

<!-- Validate Schema -->
npx prisma validate


