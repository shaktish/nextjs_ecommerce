type LookupItem = {
  id: string;
  name: string;
};

export type ProductLookup = {
  brands: LookupItem[];
  gender: LookupItem[];
  size: LookupItem[];
} | null;

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  isLeaf: boolean;
  level: number;
  isActive: boolean;
  imageUrl?: string | null;
  slug: string;
  updatedAt: Date;
}

export interface ProductCategories {
  [parentId: string]: Category[];
}

export interface Variant {
  id?: string | null | undefined;
  sizeId: string;
  price: number;
  stock: number;
}

export interface VariantForTable extends Omit<Variant, "stock"> {
  stock: {
    quantity: number;
  };
}

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
    id?: string;
    sizeId: string;
    price: number;
    stock: number;
  }[];
};

export interface ProductSlug {
  slug: string;
  categorySlug: string;
  updatedAt: Date;
}
