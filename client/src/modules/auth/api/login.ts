"use server";
import { backendClient } from "@/lib/backend/client";
import { throwIfNotOk } from "@/helper/api/throwIfNotOkay";
import { LoginResponse, LoginUserFormData } from "../auth.types";

async function login(data: LoginUserFormData): Promise<LoginResponse> {
  const { response } = await backendClient(`/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await throwIfNotOk(response, "Failed to login");
  return response.json();
}

export default login;
