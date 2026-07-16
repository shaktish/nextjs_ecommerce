import AccountNav from "@/modules/account/components/AccountNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-6">
      <AccountNav />

      {children}
    </div>
  );
}
