"use server";
import { LoginResponse, LoginUserFormData } from "../auth.types";
import { withServerActionAuth } from "@/lib/auth/withServerActionAuth";

async function login(data: LoginUserFormData): Promise<LoginResponse> {
  const response = await withServerActionAuth(`/api/auth/login`, {
    skipAuth: true,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  return result;
}

export default login;
