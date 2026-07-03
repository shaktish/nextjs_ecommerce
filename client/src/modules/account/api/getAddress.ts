import { cookies } from "next/headers";

async function getAddress() {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.API_URL}/api/address`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching address list");
  }
  return response.json();
}

export default getAddress;
