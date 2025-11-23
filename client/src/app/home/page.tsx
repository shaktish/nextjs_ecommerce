import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
function Home() {
  // const { logout } = useAuthStore();
  // const logoutHandler = () => {
  //   logout();
  // };
  return (
    <div>
      Home page
      <Link
        href={"/admin"}
        className="text-[#000] hover:underline font-bold ml-2"
        aria-label="Register page"
      >
        Register
      </Link>
      {/* <Button onClick={logoutHandler} aria-label="Logout">
        Logout
      </Button> */}
    </div>
  );
}

export default Home;
