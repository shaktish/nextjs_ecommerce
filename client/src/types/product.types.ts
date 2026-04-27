export interface Category {
    id: string,
    name: string,
    parentId: string | null,
    isLeaf: boolean,
    level: number,
    isActive: boolean,
    imageUrl?: string | null,
    slug: string,
}


export type Variant = {
    id?: string | null | undefined;
    sizeId: string;
    price: number;
    stock: number;
};

export type ProductApiResponse = {
    id: string;
    name: string;
    brandId: string;
    description: string;
    categoryId: string;
    genderId: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    isFeatured: boolean;

    images: {
        id: string;
        url: string;
        publicId: string;
    }[];

    variants: {
        id?: string,
        sizeId: string;
        price: number;
        stock: number;
    }[];
};