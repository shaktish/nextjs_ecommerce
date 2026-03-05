// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "../generated/prisma/index";
import { hashPassword } from "../src/utils/hashPassword";
import { brands, categories, genders, products, sizes, } from "../src/lookup/lookup";

const prisma = new PrismaClient();

const createAdminUser = async () => {
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

const seedBrand = async () => {
    for (const brand of brands) {
        await prisma.brand.upsert({
            where: {
                id: brand.id
            },
            update: {},
            create: brand
        })
    }
    console.log("Brands seeded");
}

const seedGender = async () => {
    for (const gender of genders) {
        await prisma.gender.upsert({
            where: {
                id: gender.id
            },
            update: {},
            create: gender
        })
    }
    console.log('gender seeded')

}

const seedSizes = async () => {
    for (const size of sizes) {
        await prisma.size.upsert({
            where: {
                id: size.id,
            },
            update: {},
            create: size
        })
    }

    console.log('Sizes seeded for men and women')
}

const seedCategories = async () => {

    for (const category of categories) {
        await prisma.category.upsert({
            where: { id: category.id },
            update: {},
            create: category
        })
    }
};

const seedProducts = async () => {
    for (const product of products) {
        await prisma.product.upsert({
            where: {
                name_brandId: {
                    name: product.name,
                    brandId: product.brandId
                }
            },
            update: {},
            create: {
                name: product.name,
                description: product.description,
                brandId: product.brandId,
                categoryId: product.categoryId,
                genderId: product.genderId
            }
        })
    }

}

const addLookups = async () => {
    await prisma.$transaction(async (tx) => {
        await seedBrand();
        await seedGender();
        await seedSizes();
        await seedCategories();
        await seedProducts();
    });

}

async function main() {
    await createAdminUser();
    await addLookups();
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });