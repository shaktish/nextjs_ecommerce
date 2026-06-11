# Prisma

### Open Prisma Studio

`npx prisma studio`

### Generate Prisma Client

- Whenever you change schema.prisma.
  `npx prisma generate`
  OR
  `npm run prisma:generate`

What it does:

- Reads schema.prisma
- Generates Prisma Client

### Seed Database

npx prisma db seed

### Create Migration + Apply to Database

```
npx prisma migrate dev --name add_users
```

What it does:

- Generates SQL migration
- Applies migration
- Updates \_prisma_migrations
- Regenerates Prisma Client

### Check Migration Status

`npx prisma migrate status`

### Reset Database

npx prisma migrate reset
