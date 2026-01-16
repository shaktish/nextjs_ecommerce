"use client";
import Image from "next/image";
import logo from "../../../../../public/images/logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../ui/sheet";
import { Button } from "@/components/ui/button";
import { CornerDownLeft, Menu, ShoppingBag, User } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface MobileNavProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  mobileView: "menu" | "account";
  setMobileView: React.Dispatch<React.SetStateAction<"menu" | "account">>;
  onLinkClickHandler: () => void;
  logoutHandler: () => void;
  navItems: { title: string; to: string }[];
}

function MobileNav({
  setOpen,
  open,
  mobileView,
  setMobileView,
  onLinkClickHandler,
  logoutHandler,
  navItems,
}: MobileNavProps) {
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
            <nav className="space-y-2">
              <Link
                href={"/account"}
                className="block w-full p-2"
                onClick={onLinkClickHandler}
              >
                Your Account
              </Link>
              <Button onClick={logoutHandler}>Logout</Button>
            </nav>
          </div>
        );
      }
      default:
        return (
          <div>
            <div className="space-y-3">
              {navItems.map((item) => {
                return (
                  <Link
                    className="block w-full p-2"
                    href={item.to}
                    key={item.title}
                    onClick={onLinkClickHandler}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
            <div className="space-y-4 p-2">
              <Button
                className="w-full justify-start"
                onClick={() => setMobileView("account")}
              >
                <User className="mr-3 h-4 w-4" />
                Account
              </Button>
              <Button
                className="w-full justify-start"
                onClick={() => {
                  onLinkClickHandler();
                  router.push("/cart");
                }}
              >
                <ShoppingBag className="mr-3 h-4 w-4" />
                Cart
              </Button>
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
          </SheetHeader>
          {renderMobileMenuItems()}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNav;
