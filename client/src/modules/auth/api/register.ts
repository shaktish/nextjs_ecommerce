"use server";
import { backendClient } from "@/lib/backend/client";
import { RegisterUserFormData } from "../auth.types";
import { throwIfNotOk } from "@/helper/api/throwIfNotOkay";

async function register(data: RegisterUserFormData) {
  const { response } = await backendClient(`/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await throwIfNotOk(response, "Failed to register your profile");
  return response.json();
}

export default register;
