import { backendClient } from "@/lib/backend/client";

async function getAddressById(id: string) {
  const { response } = await backendClient(`/api/address/${id}`);

  if (!response.ok) {
    throw new Error("Error fetching address");
  }
  return response.json();
}

export default getAddressById;
