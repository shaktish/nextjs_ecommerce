"use client";
import { useProductStore } from "@/store/useProductStore";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

function Collections() {
  const { isLoading, getProductCategories, productParentCategories } =
    useProductStore();

  useEffect(() => {
    if (!productParentCategories.length) {
      getProductCategories();
    }
  }, [productParentCategories.length, getProductCategories]);

  const columns =
    productParentCategories.length <= 2
      ? "grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="p-6">
      <div className="text-center mb-3">
        <h1 className="text-4xl font-bold mb-4">Our collections</h1>
        <p className="text-lg">Explore our wide range of products!</p>
      </div>

      <div className={`grid ${columns} gap-6`}>
        {productParentCategories.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="group cursor-pointer"
          >
            <div className="overflow-hidden rounded-lg">
              <Image
                src={category.imageUrl || "/default-category.jpg"}
                alt={category.name}
                width={500}
                height={500}
                className="w-full object-cover group-hover:scale-105 transition"
              />
            </div>

            <h2 className="mt-2 text-lg font-semibold text-center">
              {category.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Collections;
