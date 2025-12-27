"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductStore } from "@/store/useProductStore";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProductListAdmin = () => {
  const router = useRouter();
  const { getAllProductAdmin, products, isLoading, removeProduct } =
    useProductStore();

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
      console.log(response, "response");
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-1 bg-grey-100 overflow-hidden">
                            {item.images[0] && (
                              <Image
                                src={item.images[0].url || ""}
                                alt="product"
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                          <div className="font-medium">
                            <p>{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Size: {item.sizes.join(",")}
                            </p>
                            <p></p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.stock} Item(s) left</TableCell>
                      <TableCell className="font-medium">
                        {item.category.toLocaleUpperCase()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            onClick={() => {
                              editProductHandler(item.id);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            onClick={() => deleteProductHandler(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
