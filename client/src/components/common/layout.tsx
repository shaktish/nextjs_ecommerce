"use client";

import { usePathname } from "next/navigation";
import Header from "../client/header/header";

const pathsNotToShowHeaders = ["/auth", "/admin"];

function CommonLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const showClientHeader = !pathsNotToShowHeaders.some((currentPath) =>
    pathName.startsWith(currentPath),
  );
  return (
    <div className="min-h-screen bg-background">
      {showClientHeader && <Header />}
      <main>{children}</main>
    </div>
  );
}

export default CommonLayout;
