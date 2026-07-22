export type RegisterUserFormData {
  name: string;
  email: string;
  password: string;
}

export type LoginUserFormData = Omit<RegisterUserFormData, "name">;

export type UserRole = "User" | "Admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}
export interface LoginResponse {
  user: AuthUser;
}
