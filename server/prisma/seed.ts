// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "../generated/prisma/index";
import { hashPassword } from "../src/utils/hashPassword";

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

    const hashedPassword = await hashPassword(password);
    const adminUser = await prisma.user.create({
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
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });