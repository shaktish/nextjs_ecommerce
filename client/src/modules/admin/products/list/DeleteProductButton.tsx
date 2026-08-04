"use client";

import AlertModal from "@/components/common/alert-modal";
import { Button } from "@/components/ui/button";
import deleteProduct from "@/modules/admin/products/api/deleteProduct";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  id: string;
};

export default function DeleteProductButton({ id }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteProduct(`${id}`);
      toast.success("Product deleted successfully");
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete product");
    }
  };

  return (
    <AlertModal
      title="Delete Address"
      action={
        <Button variant="outline" onClick={handleDelete}>
          Delete
        </Button>
      }
      trigger={
        <button className="cursor-pointer">
          <Trash2 className="h-4 w-4" />
        </button>
      }
      description="This action cannot be undone."
    />
  );
}
