# Project setup
## Install following depencies 
- **@prisma/client** → Prisma ORM runtime (used after generating the client)  
- **axios** → For making HTTP requests  
- **bcryptjs** → For password hashing  
- **cloudinary** → Cloud image/file storage SDK  
- **cookie-parser** → Middleware to parse cookies in Express  
- **cors** → Middleware for handling CORS  
- **dotenv** → Loads environment variables from `.env`  
- **express** → Web framework for Node.js  
- **jose / jsonwebtoken** → JWT handling & modern JOSE utilities *(you might not need both unless experimenting)*  
- **lodash** → Utility library  
- **multer** → Middleware for file uploads  
- **nodemailer** → Email sending library  
- **uuid** → For generating unique IDs  
```sh
npm install @prisma/client axios bcryptjs cloudinary cookie-parser cors dotenv express jose jsonwebtoken lodash multer nodemailer uuid
npm install -D @types/bcryptjs @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/lodash @types/multer @types/node @types/nodemailer nodemon prisma ts-node typescript
```

### Typescript 
```javascript 
{
  "compilerOptions": {
    "target": "es2016",
    "module": "esnext",
    "rootDir": "./",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "incremental": true
  },
  "include": ["src/**/**", "prisma/**/**"]
}

```

### Adding postgress via docker

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:13
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - "5434:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
volumes:
  postgres-data:

```
### Running Postgres thru Docker 
run the postgres
``` docker compose up --build```
run compose ps to check the services 
``` docker compose ps ```


### env file 
```
DATABASE_URL="postgresql://user:password@localhost:5434/nextecommerce"
```

### Init Prisma 
- run the below command 
- ```npx prisma init ```


## Flow 
- Auth flow 
  - Register 
    - via Nextjs send a api call with this data 
    - validate user data
    - call our backend api 
      - this backend api will interact with prisma and postgres then it's going to save the data 
  - Login 

## Prisma Boostrap 
### 1. For auth flow, lets create a User model in schema.prisma file 
```prisma
// ===== USERS =====
enum Role {
  User
  Admin
}
model User {
  id String @id @default(cuid())
  name String?
  email String @unique
  password String 
  role Role @default(User)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  refreshToken String @unique
}
```
### 2. Generate Prisma Client
```yaml 
npx prisma generate
```
what is does ?
- After creating a model, run npx prisma generate command
- Generates the Prisma Client, a TypeScript/JS library for type-safe queries (CRUD, filtering, relations, etc.).
- Reads schema.prisma and creates a client with methods like:
```javascript    
prisma.user.findUnique()
prisma.user.create()
prisma.product.findMany()
```
Every time you add, remove, or change a model in schema.prisma.
- Ensures your Prisma client is up-to-date with your schema.
  
###  3. Apply Migrations 
```npx prisma migrate dev --name init ```

What it does:
- Compares your schema.prisma with the current database.
- Creates migration SQL files in prisma/migrations.
- Applies the migrations to the database (creates tables/columns).
- Updates the Prisma Client automatically.
Notes:
- ```--name init``` is just a label for your migration.
- After this, your database tables match your Prisma models (e.g., User table exists).

### After these steps:
- Your database is ready with the User table.
- Prisma Client is ready for type-safe queries in your Node.js/TypeScript code.

### 4. Seed 
A seed.ts file is a script that populates your database with initial or default data. This is called seeding the database.

For example:
- Admin users
- Default roles
- Categories for products
- Sample products

#### Why do we need it?
Bootstrap the system
- When you start a new project, your database is empty.
- You might need a default admin account to log in and manage the system.
- Seeding automatically creates this account instead of creating it manually.

Consistency across environments
- For development, staging, or testing, you want predictable initial data.
- Running seed.ts ensures every developer or environment starts with the same default data.

Testing
- Seeds provide sample data to test features without manually inserting data.
- Example: sample users, products, orders.

Time saver
- Instead of manually inserting rows every time, you just run ts-node prisma/seeds.ts.

The seed.ts file is essentially a one-time setup script (or repeatable for dev/testing) to populate your database with necessary default data so your app is ready to run immediately.

**Run the below script**

```javascript
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = "admin@gmail.com"
    const password = "123456"
    const name = "Admin"

    const existingAdmin = await prisma.user.findFirst({
        where: { role: 'Admin' }
    })

    if (existingAdmin) {
        console.log("Admin user already exists");
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await prisma.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: 'Admin'
        }
    })

    console.log("Admin user created:", adminUser.email);

}

main()
    .catch((e) => {
        process.exit(1)
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
```