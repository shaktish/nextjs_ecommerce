"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProductListAdmin = () => {
  const router = useRouter();

  const {
    getAllProductAdmin,
    products,
    isLoading,
    removeProduct,
    getLookup,
    getCategoriesLookup,
    productLookup,
    categoriesLookup,
  } = useProductStore();

  useEffect(() => {
    if (!productLookup) {
      getLookup();
    }
    if (!categoriesLookup.length) {
      getCategoriesLookup();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getAllProductAdmin();
    };

    fetchData();
  }, []);

  const addNewProduct = () => {
    router.push("/admin/products/add");
  };

  const editProductHandler = (id: string) => {
    router.push(`/admin/products/add?id=${id}`);
  };

  const deleteProductHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const response = await removeProduct(id);
      if (response) {
        toast.success("Product deleted successfully");
        await getAllProductAdmin();
      }
    }
  };

  if (isLoading) {
    return <Spinner className="mx-auto h-16 w-16" scale={2} />;
  }

  return (
    <div>
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <header className="flex items-center justify-between">
            <h1>All Products</h1>
            <Button onClick={addNewProduct}>Add New Product</Button>
          </header>
          <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto ">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {products?.map((item) => (
                  <div
                    key={item.id}
                    className="group border rounded-lg p-4 shadow-sm relative"
                  >
                    <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => editProductHandler(item.id)}
                        className="p-1 rounded bg-gray-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProductHandler(item.id)}
                        className="p-1 rounded bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="w-full aspect-[3/4] bg-gray-100 rounded-md overflow-hidden">
                      {item.images?.[0] ? (
                        <Image
                          src={item.images[0].url}
                          alt="product"
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-gray-500 bg-gray-100">
                          No Image Found
                        </div>
                      )}
                    </div>
                    <p className="font-medium">{item.name}</p>
                    <div className="mt-3 text-sm">
                      <div className="grid grid-cols-3 font-semibold border-b pb-1">
                        <span>Size</span>
                        <span>Stock</span>
                        <span>Price</span>
                      </div>

                      {item.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="grid grid-cols-3 py-1 text-muted-foreground"
                        >
                          <span>{variant.sizeId}</span>
                          <span>{variant.stock?.quantity ?? 0}</span>
                          <span>₹{variant.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {!isLoading && products?.length === 0 && (
              <div className=" text-center w-100 text-muted-foreground py-4">
                <p>No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListAdmin;
