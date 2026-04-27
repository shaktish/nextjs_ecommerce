"use client";

import Image from "next/image";
import logo from "../../../../public/images/logo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "../../ui/button";

import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu";
import { useState } from "react";
import MobileNav from "./components/mobileNav";

const navItems = [
  {
    title: "Home",
    to: "/home",
  },
  {
    title: "All Collections",
    to: "/collections",
  },
  {
    title: "Mens Collections",
    to: "/collections/men",
  },
  {
    title: "Womens Collections",
    to: "/collections/women",
  },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuthStore();
  const pathname = usePathname();
  const [mobileView, setMobileView] = useState<"menu" | "account">("menu");

  const router = useRouter();

  const onLinkClickHandler = () => {
    setOpen(false);
  };

  const logoutHandler = async () => {
    await logout();
    setOpen(false);
    setMobileView("menu");
    router.push("/auth/login");
  };

  const isActive = (itemPath: string) => {
    if (itemPath === "/collections") {
      return pathname === "/collections"; // only exact
    }

    return pathname.startsWith(itemPath);
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href={"/home"}>
            <Image
              src={logo}
              alt={"SA Shopping"}
              style={{ width: "auto", height: "100px" }}
              className="cursor-pointer"
              onClick={() => router.push("/")}
            />
          </Link>
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <nav className="flex items-center space-x-8">
              {navItems.map((item, index) => {
                return (
                  <Link
                    href={item.to}
                    key={index}
                    className={`text-lg font-semibold hover:text-gray-500 text-black transition-colors duration-100  ${
                      isActive(item.to) ? "text-red-400" : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <div
              className="relative cursor-pointer"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-black text-white  text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/account")}>
                  Your Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logoutHandler}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <MobileNav
            mobileView={mobileView}
            navItems={navItems}
            onLinkClickHandler={onLinkClickHandler}
            open={open}
            setMobileView={setMobileView}
            setOpen={setOpen}
            logoutHandler={logoutHandler}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
