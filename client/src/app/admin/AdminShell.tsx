"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/sidebar";
import { cn } from "@/lib/utils";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div
        className={cn(
          "transition-all duration-300 min-h-screen",
          isSidebarOpen ? "ml-50" : "ml-16",
        )}
      >
        {children}
      </div>
    </div>
  );
}
