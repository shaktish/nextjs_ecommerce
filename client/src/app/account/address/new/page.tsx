import AddressForm from "@/modules/account/components/AddressForm";

function NewAddress() {
  return (
    <div>
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-center">Add New Address</h1>
        <AddressForm mode={"add"} />
      </div>
    </div>
  );
}

export default NewAddress;
