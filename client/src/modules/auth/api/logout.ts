"use server";
import { backendClient } from "@/lib/backend/client";
import { throwIfNotOk } from "@/helper/api/throwIfNotOkay";

async function logout() {
  const { response } = await backendClient(`/api/auth/logout`, {
    method: "POST",
  });
  await throwIfNotOk(response, "Failed to logout");
  return response.json();
}

export default logout;
