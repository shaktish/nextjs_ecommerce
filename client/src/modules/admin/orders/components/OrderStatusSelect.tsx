import { AdminOrder, OrderStatus } from "@/types/order.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../api/orders";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-700",
  PROCESSING: "bg-blue-500/15 text-blue-700",
  SHIPPED: "bg-indigo-500/15 text-indigo-700",
  DELIVERED: "bg-emerald-500/15 text-emerald-700",
  CANCELLED: "bg-red-500/15 text-red-700",
};

const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const statusLabel = (status: OrderStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

function OrderStatusSelect({ order }: { order: AdminOrder }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(order.id, status),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error) => toast.error(error.message),
  });
  const options = statusTransitions[order.status];
  if (!options.length) {
    console.log("in", order.status);
    return (
      <>
        <Badge className={statusStyles[order.status]}>
          {statusLabel(order.status)}
        </Badge>
      </>
    );
  }

  return (
    <Select
      value={order.status}
      disabled={mutation.isPending}
      onValueChange={(value) => mutation.mutate(value as OrderStatus)}
    >
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={order.status}>
          {statusLabel(order.status)}
        </SelectItem>
        {options.map((status) => (
          <SelectItem key={status} value={status}>
            {statusLabel(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default OrderStatusSelect;
