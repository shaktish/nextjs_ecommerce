"use client";

import { Pagination } from "@/components/common/Pagination";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminOrders } from "@/modules/admin/orders/api/orders";
import OrderStatusSelect from "@/modules/admin/orders/components/OrderStatusSelect";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ManageOrdersAdmin() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-orders", { page, limit }],
    queryFn: () => getAdminOrders({ page, limit }),
  });
  const nextPageHandler = () => {
    setPage((page) => page + 1);
  };

  const prevPageHandler = () => {
    setPage((page) => page - 1);
  };

  const goToPageHandler = (page: number) => {
    setPage(page);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header>
          <h1>Manage Orders</h1>
          <p className="text-sm text-muted-foreground">
            Review orders and update their fulfilment status.
          </p>
        </header>
        <div className="rounded-lg border bg-card">
          {isLoading ? (
            <Spinner className="mx-auto my-12 h-10 w-10" scale={2} />
          ) : null}
          {isError ? (
            <p className="py-12 text-center text-destructive">
              Unable to load orders.
            </p>
          ) : null}
          {!isLoading && !isError && data?.orders.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No orders found.
            </p>
          ) : null}
          {!isLoading && !isError && data?.orders.length ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Placed</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.itemCount}</TableCell>
                      <TableCell className="font-medium">
                        ₹{order.total.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <OrderStatusSelect order={order} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={page}
                totalPages={data?.total || 10}
                onPrevPage={prevPageHandler}
                onNextPage={nextPageHandler}
                onGoToPage={goToPageHandler}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
