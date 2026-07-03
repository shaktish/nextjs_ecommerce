import AccountNav from "@/modules/account/components/AccountNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <AccountNav />

      {children}
    </div>
  );
}
