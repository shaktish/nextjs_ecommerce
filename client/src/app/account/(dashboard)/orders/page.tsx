import OrderSkeleton from "@/modules/orders/api/OrderSkeletonLoader";
import ListOrders from "@/modules/orders/ordersContent";
import { Suspense } from "react";

async function Orders() {
  return (
    <div>
      <Suspense fallback={<OrderSkeleton />}>
        <ListOrders />
      </Suspense>
    </div>
  );
}

export default Orders;
