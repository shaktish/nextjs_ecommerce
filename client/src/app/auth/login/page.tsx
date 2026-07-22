"use client";
import Image from "next/image";
import banner from "../../../../public/images/banner.jpg";
import logo from "../../../../public/images/logo.png";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import login from "@/modules/auth/api/login";

function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser, user } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await login(formData);
      setUser(response.user);
      toast.success("Login Successful");
      router.push(response.user.role === "Admin" ? "/admin" : "/");
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unable to register";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#fff6f4] flex">
      <div className="hidden lg:block w-1/2 bg-[#ffede1] relative overflow-hidden">
        <Image
          src={banner}
          alt={"Register"}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center">
        <div className="flex justify-center">
          <Image src={logo} alt={"SA Clothing Logo"} width={200} height={50} />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="Enter your email"
              required
              className="bg-[#ffede1]"
              onChange={handleOnInputChange}
              value={formData?.email}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="bg-[#ffede1]"
              onChange={handleOnInputChange}
              value={formData.password}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-black transition-colors mt-4"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
          <p className="text-center text-[#353d56] text-sm mt-2">
            New here
            <Link
              href={"/auth/register"}
              className="text-[#000] hover:underline font-bold ml-2"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
