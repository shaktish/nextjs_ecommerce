"use client";

import AdminSidebar from "@/components/admin/sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={cn(
          "transition-all duration 300",
          isSidebarOpen ? "ml-50" : "ml-16",
          "min-h-screen"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
