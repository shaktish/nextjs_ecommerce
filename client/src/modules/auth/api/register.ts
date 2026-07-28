"use server";
import { RegisterUserFormData } from "../auth.types";
import { withServerActionAuth } from "@/lib/auth/withServerActionAuth";

async function register(data: RegisterUserFormData) {
  const response = await withServerActionAuth(`/api/auth/register`, {
    skipAuth: true,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (response.status !== 201) {
    return {
      success: false,
      message: result.message,
    };
  }
  return {
    success: true,
    data: result,
  };
}

export default register;
