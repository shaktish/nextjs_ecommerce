export const brands = [
    {
        id: "roadster",
        name: "Roadster",
        slug: "roadset"
    },
    {
        id: "vanheusen",
        name: "Van heusen",
        slug: "van-heusen"
    },
    {
        id: "kancheepuram",
        name: "Kancheepuram",
        slug: "kancheepuram"
    }
]

export const genders = [
    {
        id: "men",
        name: "Men",
        slug: 'men'
    },
    {
        id: "women",
        name: "Women",
        slug: 'women'
    },
]

export const sizes = [
    {
        id: "small",
        name: "S",
        slug: 'small',
        sortOrder: 1,
    },
    {
        id: "medium",
        name: "M",
        slug: 'medium',
        sortOrder: 2,
    },
    {
        id: "large",
        name: "L",
        slug: 'large',
        sortOrder: 3,
    },
    {
        id: "extralarge",
        name: "XL",
        slug: 'xl',
        sortOrder: 4,
    },
    {
        id: "freeSize",
        name: "Free Size",
        slug: 'free-size',
        sortOrder: 5,
    }
]

export const categories = [
    { id: "men", name: "Men", slug: 'men', level: 0, parentId: null, isLeaf: false },
    { id: "women", name: "Women", slug: 'women', level: 0, parentId: null, isLeaf: false },
    { id: "men-tshirts", name: "Tshirts", slug: 't-shirts', level: 1, isLeaf: true, parentId: "men" },
    { id: "men-jeans", name: "Jeans", slug: 'jeans', level: 1, isLeaf: true, parentId: "men" },
    { id: "women-saree", name: "Saree", slug: 'saree', level: 1, isLeaf: true, parentId: 'women' }
];

// Product 
const vanheusen = brands[1].id
const kancheepuramBrand = brands[2].id
const menTshirt = categories[2].id;
const menGender = genders[0].id
const womenGender = genders[0].id
const largeSize = sizes[2].id
const mediumSize = sizes[1].id
const freeSize = sizes[4].id
const womenSareeCategory = categories[4].id
export const products = [
    {
        name: "Vanheusen Tshirt Seeded",
        brandId: vanheusen,
        description: "Soft, breathable 100% cotton t-shirt with durable stitching and a relaxed fit",
        categoryId: menTshirt,
        genderId: menGender,
        isFeatured: false,
        variants: [
            {
                "sizeId": largeSize,
                "price": 999,
                "stock": { "quantity": 50 }
            },
            {
                "sizeId": mediumSize,
                "price": 999,
                "stock": { "quantity": 30 }
            }
        ]

    },
    {
        name: "Saree Seeded",
        brandId: kancheepuramBrand,
        description: "Embody traditional grace with our Kancheepuram Silk Red Saree adorned with florals and leaves in zari. The self design border embellished with florals and leaves in lines paints a surreal canvas. The divine appearance is concluded with an elegant floral brocade pallu harmonizing beautifully with the self with border blouse, thus embodying timeless heritage.",
        categoryId: womenSareeCategory,
        genderId: womenGender,
        isFeatured: false,
        variants: [
            {
                "sizeId": freeSize,
                "price": 999,
                "stock": { "quantity": 50 }
            }
        ]

    }
]