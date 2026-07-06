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
import { useEffect, useState } from "react";
import MobileNav from "./components/mobileNav";
import { useCartStore } from "@/store/useCartStore";
import ThemeToggle from "./components/ThemeToggle";
import UserLoginButton from "./components/UserLoginButton";
import { useStoreHydrated } from "@/hooks/useStoreHydrated";

const navItems = [
  {
    title: "Home",
    to: "/",
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
    title: "Women Collections",
    to: "/collections/women",
  },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { logout, user, isLoading: isAuthLoading } = useAuthStore();
  const hydrated = useStoreHydrated();

  const pathname = usePathname();
  const [mobileView, setMobileView] = useState<"menu" | "account">("menu");
  const { getCartItems, items, hasFetchedCartItems } = useCartStore();

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
    if (itemPath === "/" || itemPath === "/collections") {
      return pathname === itemPath;
    }

    return pathname.startsWith(itemPath);
  };

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [user?.id]);

  if (!hydrated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href={"/"}>
            <Image
              src={logo}
              alt={"SA Shopping"}
              width={100}
              height={100}
              className="cursor-pointer"
              onClick={() => router.push("/")}
              priority
            />
          </Link>
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <nav className="flex items-center space-x-8">
              {navItems.map((item, index) => {
                return (
                  <Link
                    href={item.to}
                    key={index}
                    className={`text-lg font-semibold hover:text-gray-500 transition-colors duration-100  ${
                      isActive(item.to) ? "text-red-400" : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
          {
            <>
              <div className="hidden lg:flex items-center space-x-4">
                {user && hasFetchedCartItems && (
                  <>
                    <div
                      className="relative cursor-pointer"
                      onClick={() => router.push("/cart")}
                    >
                      <ShoppingCart />
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {items?.length || 0}
                      </span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <User className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push("/account")}
                        >
                          Your Account
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logoutHandler}>
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
                {!user && !isAuthLoading && <UserLoginButton />}
                <div>
                  <ThemeToggle isMobile={false} />
                </div>
              </div>
            </>
          }

          <MobileNav
            mobileView={mobileView}
            navItems={navItems}
            onLinkClickHandler={onLinkClickHandler}
            open={open}
            setMobileView={setMobileView}
            setOpen={setOpen}
            logoutHandler={logoutHandler}
            isLoggedIn={user?.id ? true : false}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
