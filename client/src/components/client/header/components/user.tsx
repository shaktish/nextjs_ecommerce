import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

function UserButton() {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-between gap-2 items-center">
        <Button
          variant={"outline"}
          onClick={() => router.push("/auth/login")}
          className="cursor-pointer"
        >
          <User className="h-5 w-5" /> Login
        </Button>
      </div>
    </>
  );
}

export default UserButton;
