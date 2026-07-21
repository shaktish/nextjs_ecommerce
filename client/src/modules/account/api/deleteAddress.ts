import bffFetch from "@/lib/bffClient";

async function deleteAddress({ id }: { id: string }) {
  const response = await bffFetch(`/address/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error deleting address");
  }
  return response.json();
}

export default deleteAddress;
