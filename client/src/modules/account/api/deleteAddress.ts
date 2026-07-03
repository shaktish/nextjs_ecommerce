async function deleteAddress({ id }: { id: string }) {
  const response = await fetch(`/api/address/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error deleting address");
  }
  return response.json();
}

export default deleteAddress;
