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
    images: string[];
    isFeatured?: boolean;
};