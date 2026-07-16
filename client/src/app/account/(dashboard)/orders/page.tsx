import ListOrders from "@/modules/orders/ordersContent";

async function Orders({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
  };
}) {
  return (
    <div>
      <ListOrders searchParams={searchParams} />
    </div>
  );
}

export default Orders;
