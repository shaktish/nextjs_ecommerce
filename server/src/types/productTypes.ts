export interface ProductImage {
    id: string,
    url: string,
    publicId: string,
    productId: string
}


export type Product = {
    name: string;
    brand: string;
    description: string;
    category: string;
    gender: string;
    sizes: string[];
    colors: string[];
    price: number;
    stock: number;
    images: ProductImage[];
    isFeatured?: boolean;
};