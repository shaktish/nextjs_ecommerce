"use client";

import { getOrders } from "./api/getOrder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Order, OrderStatus } from "@/types/order.types";
import { getFormattedDate } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "@/components/common/Pagination";
import { updatePageParam } from "../collections/utils/queryParams";
import { startTransition } from "react";
import OrderSkeleton from "./api/OrderSkeletonLoader";

const orderStatusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",

  PROCESSING: "bg-blue-500/15 text-blue-600 dark:text-blue-400",

  SHIPPED: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",

  DELIVERED: "bg-success/15 text-success",

  CANCELLED: "bg-destructive/15 text-destructive",
};

function ListOrders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("per-page")) || 5;

  const { data, isLoading } = useQuery({
    queryKey: ["orders", currentPage, limit],
    queryFn: () =>
      getOrders({
        page: currentPage,
        limit,
      }),
  });

  const updateRoute = (params: URLSearchParams) => {
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const nextPageHandler = () => {
    const params = updatePageParam(searchParams, currentPage + 1);
    updateRoute(params);
  };

  const prevPageHandler = () => {
    const params = updatePageParam(searchParams, currentPage - 1);
    updateRoute(params);
  };

  const goToPageHandler = (page: number) => {
    const params = updatePageParam(searchParams, page);
    updateRoute(params);
  };

  if (isLoading) {
    return <OrderSkeleton />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {data?.orders?.map((order: Order) => (
        <div
          key={order.id}
          className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Order Header */}
          <div className="flex flex-wrap justify-between gap-6 bg-gray-50 px-6 py-4 border-b">
            <div className="flex gap-10 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Order Placed
                </p>
                <p className="font-medium">
                  {getFormattedDate(order.createdAt as unknown as Date, {
                    timeStyle: undefined,
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total
                </p>
                <p className="font-semibold text-lg">
                  ₹{order.total.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Ship To
                </p>
                <p className="font-medium">{order.shippingName}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Order ID
              </p>
              <p className="font-mono text-sm break-all">{order.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 border-b">
            <span className="text-sm text-muted-foreground">Order Status</span>

            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                orderStatusStyles[order.status]
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Products */}
          <div className="divide-y">
            {order.items.map((item) => (
              <Link
                key={item.name}
                href={`/collections/${item.category}/${item.slug}`}
                className="group flex flex-col gap-4 p-6  sm:flex-row"
              >
                <div className="overflow-hidden rounded-lg border bg-white">
                  <Image
                    src={
                      item.imageUrl?.trim()
                        ? item.imageUrl
                        : "/images/product-preview.jpeg"
                    }
                    alt={item.name}
                    width={150}
                    height={150}
                    className="h-[150px] w-[150px] object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:secondary-foreground transition">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 capitalize">
                      {item.category}
                    </p>

                    <p className="mt-3 text-lg font-bold text-gray-900">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-sm font-medium group-hover:underline">
                    View Product
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={data?.total || 0}
        onGoToPage={goToPageHandler}
        onNextPage={nextPageHandler}
        onPrevPage={prevPageHandler}
      />
    </div>
  );
}

export default ListOrders;
