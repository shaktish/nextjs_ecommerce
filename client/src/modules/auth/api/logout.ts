"use server";
import { withServerActionAuth } from "@/lib/auth/withServerActionAuth";

async function logout() {
  const response = await withServerActionAuth(`/api/auth/logout`, {
    method: "POST",
  });
  return response.json();
}

export default logout;
