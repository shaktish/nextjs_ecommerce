"use client";
import Image from "next/image";
import logo from "../../../../../public/images/logo.png";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../ui/sheet";
import { Button } from "@/components/ui/button";
import {
  CornerDownLeft,
  LogOut,
  LucideIcon,
  Menu,
  ShoppingBag,
  User,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import UserLoginButton from "./UserLoginButton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  mobileView: "menu" | "account";
  setMobileView: React.Dispatch<React.SetStateAction<"menu" | "account">>;
  onLinkClickHandler: () => void;
  logoutHandler: () => void;
  navItems: { title: string; to: string; icon: LucideIcon }[];
  isLoggedIn: boolean;
}

function MobileNav({
  setOpen,
  open,
  mobileView,
  setMobileView,
  onLinkClickHandler,
  logoutHandler,
  navItems,
  isLoggedIn,
}: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setTimeout(() => {
        setMobileView("menu");
      }, 200); // match Sheet close animation
    }
  };

  const renderMobileMenuItems = () => {
    switch (mobileView) {
      case "account": {
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setMobileView("menu")}
              >
                <CornerDownLeft />
              </Button>
            </div>
            <nav className="space-y-2 pl-4 pr-4">
              <Link
                href={"/account"}
                className="block w-full p-2"
                onClick={onLinkClickHandler}
              >
                Your Account
              </Link>
              <Separator className="my-4" />
              <Button
                onClick={logoutHandler}
                variant={"ghost"}
                className="cursor-pointer"
              >
                Logout
              </Button>
            </nav>
          </div>
        );
      }
      default:
        return (
          <div className="p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 transition-colors gap-3",
                      pathname === item.to
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent",
                    )}
                    href={item.to}
                    key={item.title}
                    onClick={onLinkClickHandler}
                  >
                    <Icon className="h-4 w-4" />

                    {item.title}
                  </Link>
                );
              })}
              <Separator className="my-3" />
              <div className="space-y-2">
                {isLoggedIn && (
                  <>
                    <Button
                      className={cn(
                        "w-full justify-start",
                        pathname.startsWith("/account") &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      )}
                      onClick={() => {
                        onLinkClickHandler();
                        router.push("/account");
                      }}
                      variant="ghost"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Account
                    </Button>
                    <Button
                      className={cn(
                        "w-full justify-start",
                        pathname === "/cart" &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      )}
                      onClick={() => {
                        onLinkClickHandler();
                        router.push("/cart");
                      }}
                      variant="ghost"
                    >
                      <ShoppingBag className="mr-3 h-4 w-4" />
                      Cart
                    </Button>
                    <Separator className="my-2" />
                    <Button
                      className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                      variant="ghost"
                      onClick={() => {
                        onLinkClickHandler();
                        logoutHandler();
                      }}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )}
                {!isLoggedIn && <UserLoginButton />}
                <ThemeToggle isMobile={true} />
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60">
          <SheetHeader className="p-1">
            <SheetTitle>
              <Image
                src={logo}
                alt={"SA Shopping"}
                style={{ width: "auto", height: "60px" }}
                className="cursor-pointer"
                onClick={() => router.push("/")}
              />
            </SheetTitle>
            <SheetDescription className="sr-only">
              Mobile navigation menu
            </SheetDescription>
          </SheetHeader>
          {renderMobileMenuItems()}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNav;
