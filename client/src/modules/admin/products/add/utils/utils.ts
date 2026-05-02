import { ProductFormType } from "@/schemas/productSchema";
import { Category, ProductApiResponse } from "@/types/product.types";

function buildCategoryPath(categoryId: string, categories: any[]) {
    const path: string[] = [];

    let current = categories.find((c) => c.id === categoryId);

    while (current) {
        path.unshift(current.id);
        current = categories.find((c) => c.id === current.parentId);
    }
    return path;
}

const mapProductToForm = (product: ProductApiResponse, categoriesLookup: Category[]): ProductFormType => ({
    name: product.name,
    description: product.description,
    brandId: product.brandId,
    genderId: product.genderId,
    featured: product.isFeatured,
    variants: product.variants.map((v) => ({
        id: v.id,
        sizeId: v.sizeId,
        price: v.price,
        stock: v.stock,
    })),
    categories: buildCategoryPath(product.categoryId, categoriesLookup),
});

export {
    mapProductToForm
}