import { hashPassword } from "../src/utils/hashPassword";
import {
  brands,
  categories,
  featureBannerSeed,
  genders,
  productImageSeed,
  products,
  productVariantSeed,
  sizes,
} from "../src/lookup/lookup";
import { textToSlug } from "../src/utils/slugUtil";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const createUsers = async () => {
  const users = [
    {
      email: "admin@gmail.com",
      password: "123456",
      name: "Admin",
      role: Role.Admin,
    },
    {
      email: "sk@gmail.com",
      password: "123456",
      name: "Shaktish",
      role: Role.User,
    },
  ];

  for (const user of users) {
    const hashedPassword = await hashPassword(user.password);
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        role: user.role,
      },
    });
  }
};

const createAdminUser = async () => {
  const email = "admin@gmail.com";
  const password = "123456";
  const name = "Admin";

  const existingAdmin = await prisma.user.findFirst({
    where: { role: "Admin" },
  });

  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  const hashedPassword = await hashPassword(password);
  const adminUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "Admin",
    },
  });

  console.log("Admin user created:", adminUser.email);
};

const seedBrand = async () => {
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: {
        id: brand.id,
      },
      update: {},
      create: brand,
    });
  }
  console.log("Brands seeded");
};

const seedGender = async () => {
  for (const gender of genders) {
    await prisma.gender.upsert({
      where: {
        id: gender.id,
      },
      update: {},
      create: gender,
    });
  }
  console.log("gender seeded");
};

const seedSizes = async () => {
  for (const size of sizes) {
    await prisma.size.upsert({
      where: {
        id: size.id,
      },
      update: {},
      create: size,
    });
  }

  console.log("Sizes seeded for men and women");
};

const seedCategories = async () => {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }
};

const seedProducts = async () => {
  for (const product of products) {
    await prisma.product.upsert({
      where: {
        name_brandId_categoryId: {
          name: product.name,
          brandId: product.brandId,
          categoryId: product.categoryId,
        },
      },
      update: {},
      create: {
        name: product.name,
        slug: textToSlug(product.name),
        description: product.description,
        brandId: product.brandId,
        categoryId: product.categoryId,
        genderId: product.genderId,
      },
    });
  }
};

const seedProductVariants = async () => {
  for (const item of productVariantSeed) {
    const product = await prisma.product.findUnique({
      where: {
        slug: item.productSlug,
      },
    });

    const size = await prisma.size.findUnique({
      where: {
        slug: item.sizeSlug,
      },
    });
    if (!product || !size) {
      throw new Error(
        `Missing product or size: ${item.productSlug} / ${item.sizeSlug}`,
      );
    }

    const variant = await prisma.productVariant.upsert({
      where: {
        sku: item.sku,
      },
      update: {
        price: item.price,
      },
      create: {
        productId: product.id,
        sizeId: size.id,
        sku: item.sku,
        price: item.price,
      },
    });

    await prisma.stock.upsert({
      where: {
        variantId: variant.id,
      },
      update: {
        quantity: item.stock,
      },
      create: {
        variantId: variant.id,
        quantity: item.stock,
      },
    });
  }
};

const seedBanners = async () => {
  for (const banner of featureBannerSeed) {
    await prisma.featuredBanner.upsert({
      where: {
        id: banner.publicId,
      },
      update: {},
      create: {
        publicId: banner.publicId,
        url: banner.url,
        sortOrder: banner.sortOrder,
      },
    });
  }
};

const seedProductImages = async () => {
  for (const item of productImageSeed) {
    const product = await prisma.product.findUnique({
      where: {
        slug: item.productSlug,
      },
    });

    if (product?.id) {
      await prisma.productImage.upsert({
        where: {
          publicId: item.publicId,
        },
        update: {
          url: item.url,
          productId: product.id,
        },
        create: {
          publicId: item.publicId,
          url: item.url,
          productId: product.id,
        },
      });
    }
  }
};

const addLookups = async () => {
  await prisma.$transaction(async (tx) => {
    await seedBrand();
    await seedGender();
    await seedSizes();
    await seedCategories();
    await seedProducts();
    await seedBanners();
    await seedProductVariants();
    await seedProductImages();
  });
};

async function main() {
  await createUsers();
  await addLookups();
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
