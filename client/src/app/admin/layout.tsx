import AdminShell from "./AdminShell";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

export default AdminLayout;
