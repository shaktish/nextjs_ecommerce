"use client";
import AlertModal from "@/components/common/alert-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UPDATE_ADDRESS_URL } from "@/constant/path";
import { Address } from "@/types/address.types";
import Link from "next/link";
import deleteAddress from "../api/deleteAddress";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddressCard {
  data: Address;
}

function AddressCard({ data }: AddressCard) {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const response = await deleteAddress({ id: data.id });
      if (response.message) {
        toast.success(response.message);
        router.push(`${UPDATE_ADDRESS_URL}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("something went wrong");
      }
    }
  };

  return (
    <>
      <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="space-y-2">
          <div className="flex space-x-2">
            <p className="text-base font-semibold">{data.address}</p>
            {data.isDefault && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 hover:bg-green-100"
              >
                Default
              </Badge>
            )}
          </div>
          <p className="text-sm font-semibold text-muted-foreground">
            {data.phone}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.city}, {data.state}
          </p>

          <p className="text-sm text-muted-foreground">{data.postalCode}</p>

          <p className="text-sm text-muted-foreground">{data.country}</p>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t pt-4">
          <Button className="text-sm font-medium" asChild>
            <Link href={`${UPDATE_ADDRESS_URL}/${data.id}`}>Edit</Link>
          </Button>

          <AlertModal
            title="Delete Address"
            trigger={
              <Button variant="outline" onClick={handleDelete}>
                Delete
              </Button>
            }
            description="This action cannot be undone."
          />
        </div>
      </div>
    </>
  );
}

export default AddressCard;
