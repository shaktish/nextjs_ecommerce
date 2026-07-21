import { backendClient } from "@/lib/backend/client";

export default async function getAddress() {
  const { response } = await backendClient("/api/address");

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("Unable to fetch addresses");
  }

  return response.json();
}
