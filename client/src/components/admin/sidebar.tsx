"use client";

import {
  CirclePlusIcon,
  HandCoins,
  LogOutIcon,
  Package,
  SendToBack,
  Settings,
  TicketPercent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

const menuItems = [
  {
    name: "Products",
    icon: Package,
    href: "/admin/products/list",
  },
  {
    name: "Add New Product",
    icon: CirclePlusIcon,
    href: "/admin/products/add",
  },
  {
    name: "Orders",
    icon: SendToBack,
    href: "/admin/orders",
  },
  {
    name: "Create Coupon",
    icon: HandCoins,
    href: "/admin/coupons/add",
  },
  {
    name: "Coupons",
    icon: TicketPercent,
    href: "/admin/coupons/list",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
  {
    name: "Logout",
    icon: LogOutIcon,
    href: "",
  },
];

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const AdminSidebar = ({ isOpen, toggle }: SidebarProps) => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300",
        isOpen ? "w-50" : "w-12",
        "border-r",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/admin" className={cn(!isOpen && "hidden")}>
          <h1 className="font-semibold cursor-pointer">Admin Panel</h1>
        </Link>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="ml-auto"
          onClick={toggle}
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="space-y-4 py-4">
        {menuItems.map((item) => {
          return (
            <div
              key={item.name}
              className={cn(
                "flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer",
              )}
              onClick={
                item.name === "Logout"
                  ? handleLogout
                  : () => router.push(item.href)
              }
            >
              <item.icon className="h-4 w-4" />
              <span className={cn("ml-3", !isOpen && "hidden")}>
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSidebar;
