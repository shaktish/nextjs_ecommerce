export const brands = [
  {
    id: "roadster",
    name: "Roadster",
    slug: "roadset",
  },
  {
    id: "vanheusen",
    name: "Van heusen",
    slug: "van-heusen",
  },
  {
    id: "kancheepuram",
    name: "Kancheepuram",
    slug: "kancheepuram",
  },
];

export const genders = [
  {
    id: "men",
    name: "Men",
    slug: "men",
  },
  {
    id: "women",
    name: "Women",
    slug: "women",
  },
];

export const sizes = [
  {
    id: "small",
    name: "S",
    slug: "small",
    sortOrder: 1,
  },
  {
    id: "medium",
    name: "M",
    slug: "medium",
    sortOrder: 2,
  },
  {
    id: "large",
    name: "L",
    slug: "large",
    sortOrder: 3,
  },
  {
    id: "extralarge",
    name: "XL",
    slug: "extra-large",
    sortOrder: 4,
  },
  {
    id: "freeSize",
    name: "Free Size",
    slug: "free-size",
    sortOrder: 5,
  },
];

export const categories = [
  {
    id: "men",
    name: "Men",
    slug: "men",
    level: 0,
    parentId: null,
    isLeaf: false,
    imageUrl:
      "https://res.cloudinary.com/dzpioxwhg/image/upload/v1776737983/mens-wear_kdq53s.png",
  },
  {
    id: "women",
    name: "Women",
    slug: "women",
    level: 0,
    parentId: null,
    isLeaf: false,
    imageUrl:
      "https://res.cloudinary.com/dzpioxwhg/image/upload/v1776737792/womens-wear_o0rf5e.png",
  },
  {
    id: "men-tshirts",
    name: "Tshirts",
    slug: "t-shirts",
    level: 1,
    isLeaf: true,
    parentId: "men",
  },
  {
    id: "men-jeans",
    name: "Jeans",
    slug: "jeans",
    level: 1,
    isLeaf: true,
    parentId: "men",
  },
  {
    id: "women-saree",
    name: "Saree",
    slug: "saree",
    level: 1,
    isLeaf: true,
    parentId: "women",
  },
];

// Product
const vanheusen = brands[1].id;
const kancheepuramBrand = brands[2].id;
const menTshirt = categories[2].id;
const menGender = genders[0].id;
const womenGender = genders[0].id;

const womenSareeCategory = categories[4].id;

const smallSize = sizes[0].slug;
const mediumSize = sizes[1].slug;
const largeSize = sizes[2].slug;
const extraLargeSize = sizes[3].slug;
const freeSize = sizes[4].slug;
export const products = [
  {
    name: "Van Heusen Classic T-Shirt",
    slug: "van-heusen-classic-tshirt",
    brandId: vanheusen,
    description: "Premium cotton crew neck t-shirt with regular fit.",
    categoryId: menTshirt,
    genderId: menGender,
    isFeatured: true,
  },
  {
    name: "Van Heusen Polo T-Shirt",
    slug: "van-heusen-polo-tshirt",
    brandId: vanheusen,
    description: "Comfortable polo t-shirt with breathable fabric.",
    categoryId: menTshirt,
    genderId: menGender,
    isFeatured: true,
  },
  {
    name: "Van Heusen Striped T-Shirt",
    slug: "van-heusen-striped-tshirt",
    brandId: vanheusen,
    description: "Stylish striped cotton t-shirt for everyday wear.",
    categoryId: menTshirt,
    genderId: menGender,
    isFeatured: false,
  },
  {
    name: "Van Heusen Graphic T-Shirt",
    slug: "van-heusen-graphic-tshirt",
    brandId: vanheusen,
    description: "Modern graphic print t-shirt with soft cotton fabric.",
    categoryId: menTshirt,
    genderId: menGender,
    isFeatured: false,
  },
  {
    name: "Van Heusen Solid Black T-Shirt",
    slug: "van-heusen-solid-black-tshirt",
    brandId: vanheusen,
    description: "Classic black t-shirt suitable for casual outings.",
    categoryId: menTshirt,
    genderId: menGender,
    isFeatured: false,
  },

  {
    name: "Roadster Slim Fit Jeans",
    slug: "roadster-slim-fit-jeans",
    brandId: brands[0].id,
    description: "Slim fit denim jeans with stretch comfort.",
    categoryId: categories[3].id,
    genderId: menGender,
    isFeatured: false,
  },
  {
    name: "Roadster Blue Denim Jeans",
    slug: "roadster-blue-denim-jeans",
    brandId: brands[0].id,
    description: "Classic blue denim jeans crafted for durability.",
    categoryId: categories[3].id,
    genderId: menGender,
    isFeatured: false,
  },
  {
    name: "Roadster Distressed Jeans",
    slug: "roadster-distressed-jeans",
    brandId: brands[0].id,
    description: "Trendy distressed denim with modern styling.",
    categoryId: categories[3].id,
    genderId: menGender,
    isFeatured: false,
  },
  {
    name: "Roadster Straight Fit Jeans",
    slug: "roadster-straight-fit-jeans",
    brandId: brands[0].id,
    description: "Straight fit jeans offering timeless appeal.",
    categoryId: categories[3].id,
    genderId: menGender,
    isFeatured: false,
  },
  {
    name: "Roadster Washed Denim Jeans",
    slug: "roadster-washed-denim-jeans",
    brandId: brands[0].id,
    description: "Washed denim finish for a rugged look.",
    categoryId: categories[3].id,
    genderId: menGender,
    isFeatured: false,
  },

  {
    name: "Royal Red Kancheepuram Saree",
    slug: "royal-red-kancheepuram-saree",
    brandId: kancheepuramBrand,
    description: "Elegant red silk saree with zari woven border.",
    categoryId: womenSareeCategory,
    genderId: womenGender,
    isFeatured: true,
  },
  {
    name: "Emerald Green Kancheepuram Saree",
    slug: "emerald-green-kancheepuram-saree",
    brandId: kancheepuramBrand,
    description: "Traditional green silk saree with floral motifs.",
    categoryId: womenSareeCategory,
    genderId: womenGender,
    isFeatured: true,
  },
  {
    name: "Peacock Blue Kancheepuram Saree",
    slug: "peacock-blue-kancheepuram-saree",
    brandId: kancheepuramBrand,
    description: "Rich peacock blue silk saree with gold zari work.",
    categoryId: womenSareeCategory,
    genderId: womenGender,
    isFeatured: false,
  },
  {
    name: "Golden Beige Kancheepuram Saree",
    slug: "golden-beige-kancheepuram-saree",
    brandId: kancheepuramBrand,
    description: "Luxurious beige silk saree with temple border.",
    categoryId: womenSareeCategory,
    genderId: womenGender,
    isFeatured: false,
  },
  {
    name: "Maroon Bridal Kancheepuram Saree",
    slug: "maroon-bridal-kancheepuram-saree",
    brandId: kancheepuramBrand,
    description: "Bridal silk saree featuring intricate zari weaving.",
    categoryId: womenSareeCategory,
    genderId: womenGender,
    isFeatured: false,
  },
  {
    name: "Purple Heritage Kancheepuram Saree",
    slug: "purple-heritage-kancheepuram-saree",
    brandId: kancheepuramBrand,
    description: "Traditional purple silk saree inspired by heritage designs.",
    categoryId: womenSareeCategory,
    genderId: womenGender,
    isFeatured: false,
  },
  {
    name: "Pink Floral Kancheepuram Saree",
    slug: "pink-floral-kancheepuram-saree",
    brandId: kancheepuramBrand,
    description: "Soft pink saree with floral zari patterns.",
    categoryId: womenSareeCategory,
    genderId: womenGender,
    isFeatured: false,
  },
  {
    name: "Mustard Gold Kancheepuram Saree",
    slug: "mustard-gold-kancheepuram-saree",
    brandId: kancheepuramBrand,
    description: "Mustard silk saree highlighted with golden motifs.",
    categoryId: womenSareeCategory,
    genderId: womenGender,
    isFeatured: false,
  },
  {
    name: "Ivory White Kancheepuram Saree",
    slug: "ivory-white-kancheepuram-saree",
    brandId: kancheepuramBrand,
    description: "Sophisticated ivory saree with elegant border work.",
    categoryId: womenSareeCategory,
    genderId: womenGender,
    isFeatured: false,
  },
  {
    name: "Turquoise Silk Kancheepuram Saree",
    slug: "turquoise-silk-kancheepuram-saree",
    brandId: kancheepuramBrand,
    description: "Premium silk saree with vibrant turquoise finish.",
    categoryId: womenSareeCategory,
    genderId: womenGender,
    isFeatured: false,
  },
];

export const productVariantSeed = [
  // TSHIRTS

  {
    productSlug: "van-heusen-classic-tshirt",
    sizeSlug: mediumSize,
    sku: "VAN-HEUSEN-CLASSIC-TSHIRT-M",
    price: 599,
    stock: 20,
  },
  {
    productSlug: "van-heusen-classic-tshirt",
    sizeSlug: largeSize,
    sku: "VAN-HEUSEN-CLASSIC-TSHIRT-L",
    price: 599,
    stock: 5,
  },
  {
    productSlug: "van-heusen-classic-tshirt",
    sizeSlug: extraLargeSize,
    sku: "VAN-HEUSEN-CLASSIC-TSHIRT-XL",
    price: 599,
    stock: 7,
  },
  {
    productSlug: "van-heusen-polo-tshirt",
    sizeSlug: mediumSize,
    sku: "VAN-HEUSEN-POLO-TSHIRT-M",
    price: 699,
    stock: 15,
  },
  {
    productSlug: "van-heusen-striped-tshirt",
    sizeSlug: mediumSize,
    sku: "VAN-HEUSEN-STRIPED-TSHIRT-M",
    price: 799,
    stock: 12,
  },
  {
    productSlug: "van-heusen-graphic-tshirt",
    sizeSlug: mediumSize,
    sku: "VAN-HEUSEN-GRAPHIC-TSHIRT-M",
    price: 899,
    stock: 10,
  },
  {
    productSlug: "van-heusen-solid-black-tshirt",
    sizeSlug: mediumSize,
    sku: "VAN-HEUSEN-SOLID-BLACK-TSHIRT-M",
    price: 749,
    stock: 18,
  },

  // JEANS

  {
    productSlug: "roadster-slim-fit-jeans",
    sizeSlug: largeSize,
    sku: "ROADSTER-SLIM-FIT-JEANS-L",
    price: 1499,
    stock: 10,
  },
  {
    productSlug: "roadster-blue-denim-jeans",
    sizeSlug: largeSize,
    sku: "ROADSTER-BLUE-DENIM-JEANS-L",
    price: 1599,
    stock: 10,
  },
  {
    productSlug: "roadster-distressed-jeans",
    sizeSlug: largeSize,
    sku: "ROADSTER-DISTRESSED-JEANS-L",
    price: 1699,
    stock: 8,
  },
  {
    productSlug: "roadster-straight-fit-jeans",
    sizeSlug: largeSize,
    sku: "ROADSTER-STRAIGHT-FIT-JEANS-L",
    price: 1499,
    stock: 12,
  },
  {
    productSlug: "roadster-washed-denim-jeans",
    sizeSlug: largeSize,
    sku: "ROADSTER-WASHED-DENIM-JEANS-L",
    price: 1799,
    stock: 9,
  },

  // SAREES

  {
    productSlug: "royal-red-kancheepuram-saree",
    sizeSlug: freeSize,
    sku: "ROYAL-RED-KANCHEEPURAM-SAREE-FREE",
    price: 4999,
    stock: 5,
  },
  {
    productSlug: "emerald-green-kancheepuram-saree",
    sizeSlug: freeSize,
    sku: "EMERALD-GREEN-KANCHEEPURAM-SAREE-FREE",
    price: 5499,
    stock: 5,
  },
  {
    productSlug: "peacock-blue-kancheepuram-saree",
    sizeSlug: freeSize,
    sku: "PEACOCK-BLUE-KANCHEEPURAM-SAREE-FREE",
    price: 5999,
    stock: 4,
  },
  {
    productSlug: "golden-beige-kancheepuram-saree",
    sizeSlug: freeSize,
    sku: "GOLDEN-BEIGE-KANCHEEPURAM-SAREE-FREE",
    price: 6499,
    stock: 4,
  },
  {
    productSlug: "maroon-bridal-kancheepuram-saree",
    sizeSlug: freeSize,
    sku: "MAROON-BRIDAL-KANCHEEPURAM-SAREE-FREE",
    price: 8999,
    stock: 3,
  },
  {
    productSlug: "purple-heritage-kancheepuram-saree",
    sizeSlug: freeSize,
    sku: "PURPLE-HERITAGE-KANCHEEPURAM-SAREE-FREE",
    price: 5999,
    stock: 4,
  },
  {
    productSlug: "pink-floral-kancheepuram-saree",
    sizeSlug: freeSize,
    sku: "PINK-FLORAL-KANCHEEPURAM-SAREE-FREE",
    price: 5499,
    stock: 6,
  },
  {
    productSlug: "mustard-gold-kancheepuram-saree",
    sizeSlug: freeSize,
    sku: "MUSTARD-GOLD-KANCHEEPURAM-SAREE-FREE",
    price: 6299,
    stock: 5,
  },
  {
    productSlug: "ivory-white-kancheepuram-saree",
    sizeSlug: freeSize,
    sku: "IVORY-WHITE-KANCHEEPURAM-SAREE-FREE",
    price: 6799,
    stock: 3,
  },
  {
    productSlug: "turquoise-silk-kancheepuram-saree",
    sizeSlug: freeSize,
    sku: "TURQUOISE-SILK-KANCHEEPURAM-SAREE-FREE",
    price: 7199,
    stock: 4,
  },
];

export const featureBannerSeed = [
  {
    publicId: "ecommerce-feature-banners/ojsi9iaugpvcaxdeecc9",
    url: "https://res.cloudinary.com/dzpioxwhg/image/upload/v1782136533/ecommerce-feature-banners/ojsi9iaugpvcaxdeecc9.jpg",
    sortOrder: 1,
    redirectUrl: "collections/men?brands=vanheusen",
  },
  {
    publicId: "ecommerce-feature-banners/sjuccdi639mq3smx3q9h.jpg",
    url: "https://res.cloudinary.com/dzpioxwhg/image/upload/v1782134552/ecommerce-feature-banners/sjuccdi639mq3smx3q9h.jpg",
    sortOrder: 2,
    redirectUrl: "collections/women?brands=kancheepuram&sizes=freeSize",
  },
];

export const productImageSeed = [
  {
    productSlug: "van-heusen-polo-tshirt",
    url: "https://res.cloudinary.com/dzpioxwhg/image/upload/v1777175810/ecommerce/edlvq4qncjg7jvl6piod.jpg",
    publicId: "ecommerce/edlvq4qncjg7jvl6piod.jpg",
  },
  {
    productSlug: "emerald-green-kancheepuram-saree",
    url: "https://res.cloudinary.com/dzpioxwhg/image/upload/v1777167330/ecommerce/x1g1xuazay7kubmzuopq.jpg",
    publicId: "ecommerce/fyjasf5dybymdlvvregh",
  },
];
