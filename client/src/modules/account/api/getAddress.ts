import { backendClient } from "@/lib/backend/client";
import withServerComponentAuth from "@/lib/auth/withServerComponentAuth";

export default function getAddress() {
  return withServerComponentAuth(async () => {
    const { response } = await backendClient("/api/address");

    if (response.status === 404) {
      throw new Error("Address not found");
    }

    if (!response.ok) {
      throw new Error("Unable to fetch addresses");
    }

    return response.json();
  });
}
