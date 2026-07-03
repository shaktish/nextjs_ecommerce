import getAddressById from "@/modules/account/api/getAddressById";
import AddressForm from "@/modules/account/components/AddressForm";

async function UpdateAddress({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const address = await getAddressById(id);
  return (
    <div>
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Edit New Address
        </h1>
        <AddressForm mode={"edit"} formData={address} id={id} />
      </div>
    </div>
  );
}

export default UpdateAddress;
