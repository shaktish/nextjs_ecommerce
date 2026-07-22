import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  isMobile?: boolean;
}

function ThemeToggle({ isMobile }: ThemeToggleProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };
  return (
    <Button
      variant={"ghost"}
      aria-label="toggle theme"
      onClick={toggleTheme}
      className={`cursor-pointer justify-start  flex items-center gap-1 ${isMobile ? "w-full" : ""}`}
    >
      {dark ? (
        <Sun className="mr-3 h-4 w-4" />
      ) : (
        <Moon className="mr-3 h-4 w-4" />
      )}
      {isMobile ? `Switch to ${dark ? "Light" : "Dark"} Mode` : null}
    </Button>
  );
}

export default ThemeToggle;
