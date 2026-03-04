// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "../generated/prisma/index";
import { hashPassword } from "../src/utils/hashPassword";
import { brands, categories, genders, menSubCategories, sizes, womenSubCategories } from "../src/lookup/lookup";

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
                slug: brand.slug
            },
            update: {},
            create: brand
        })
    }
    console.log("Brands seeded");
}

const seedGender = async () => {
    const map: Record<string, string> = {};
    for (const gender of genders) {
        const g = await prisma.gender.upsert({
            where: {
                slug: gender.slug
            },
            update: {},
            create: gender
        })
        map[gender.slug] = g.id
    }
    console.log('gender seeded')
    return map; // { men: 'cuid...', women: 'cuid...' }

}

const seedSizes = async (genderMap: Record<string, string>) => {
    for (const size of sizes) {
        await prisma.sizes.upsert({
            where: {
                slug_genderId: {
                    slug: size.slug,
                    genderId: genderMap.men,
                },

            },
            update: {},
            create: {
                ...size,
                genderId: genderMap.men,
            }
        })
    }

    for (const size of sizes) {
        await prisma.sizes.upsert({
            where: {
                slug_genderId: {
                    slug: size.slug,
                    genderId: genderMap.women,
                },

            },
            update: {},
            create: {
                ...size,
                genderId: genderMap.women,
            }
        })
    }

    console.log('Sizes seeded for men and women')

}

const seedCategories = async () => {
    const categoriesMap: Record<string, string> = {};
    for (const category of categories) {
        const existing = await prisma.category.findFirst({
            where: {
                slug: category.slug,
                parentId: category.parentId ?? null,
            },
        });

        if (existing) {
            categoriesMap[category.slug] = existing.id;
            continue
        }
        else {
            const data = await prisma.category.create({
                data: {
                    name: category.name,
                    slug: category.slug,
                    level: category.level,
                    parentId: category.parentId ?? null,
                    isLeaf: category.isLeaf,
                },
            });
            categoriesMap[category.slug] = data.id
        }

    }

    return categoriesMap;
}

type CategoriesMap = {
    men?: string;
    women?: string;
};

const seedSubcategoriesForParent = async (
    subCategories: typeof menSubCategories,
    parentId: string | null,
) => {
    for (const category of subCategories) {
        const existing = await prisma.category.findFirst({
            where: {
                slug: category.slug,
                parentId,
            },
        });

        if (existing) continue;

        await prisma.category.create({
            data: {
                name: category.name,
                slug: category.slug,
                level: category.level,
                parentId,
                isLeaf: category.isLeaf,
            },
        });
    }
};

const seedSubcategories = async (categoriesMap: CategoriesMap) => {
    const menParentId = categoriesMap.men ?? null;
    const womenParentId = categoriesMap.women ?? null;

    await seedSubcategoriesForParent(menSubCategories, menParentId);
    await seedSubcategoriesForParent(womenSubCategories, womenParentId);

    console.log('subcategories created');
}

const addLookups = async () => {
    seedBrand();
    const genderMap = await seedGender();
    seedSizes(genderMap);
    const categoriesMap = await seedCategories();
    seedSubcategories(categoriesMap);

}

async function main() {
    createAdminUser();
    addLookups();
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });