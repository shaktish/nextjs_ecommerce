import { Grid2X2, House, Shirt, Sparkles } from "lucide-react";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: House,
  },
  {
    title: "All Collections",
    to: "/collections",
    icon: Grid2X2,
  },
  {
    title: "Mens",
    to: "/collections/men",
    icon: Shirt,
  },
  {
    title: "Women",
    to: "/collections/women",
    icon: Sparkles,
  },
];
