import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

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
    <button
      aria-label="toggle theme"
      onClick={toggleTheme}
      className={`cursor-pointer  flex items-center gap-1 ${isMobile ? "w-full" : ""}`}
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
      {isMobile ? `Switch to ${dark ? "Light" : "Dark"} Mode` : null}
    </button>
  );
}

export default ThemeToggle;
