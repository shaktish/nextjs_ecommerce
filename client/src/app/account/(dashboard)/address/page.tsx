import { Button } from "@/components/ui/button";
import getAddress from "@/modules/account/api/getAddress";
import AddressCard from "@/modules/account/components/AddressCard";

import { Address } from "@/types/address.types";
import Link from "next/link";

async function UserAddress() {
  const { data } = await getAddress();

  return (
    <div>
      <div className="flex justify-end w-full mb-2">
        <Button asChild>
          <Link href="/account/address/new">Add Address</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.length === 0 && <p>No address found</p>}
        {data?.map((address: Address) => (
          <AddressCard key={address.id} data={address} />
        ))}
      </div>
    </div>
  );
}

export default UserAddress;
