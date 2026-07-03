"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex border-b">
      <Link
        href="/account/orders"
        className={`px-4 py-2 border-b-2 ${
          pathname === "/account/orders"
            ? "border-primary font-semibold"
            : "border-transparent"
        }`}
      >
        Orders
      </Link>

      <Link
        href="/account/address"
        className={`px-4 py-2 border-b-2 ${
          pathname === "/account/address"
            ? "border-primary font-semibold"
            : "border-transparent"
        }`}
      >
        Address
      </Link>
    </div>
  );
}
