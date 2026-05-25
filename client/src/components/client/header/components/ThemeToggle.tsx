import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle(isMobile: { isMobile?: boolean }) {
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
      onClick={toggleTheme}
      className={`cursor-pointer ${isMobile.isMobile ? "w-full justify-start" : ""}`}
    >
      Switch to {dark ? "Light" : "Dark"} Mode
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
