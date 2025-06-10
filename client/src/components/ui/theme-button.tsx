import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button variant="outline" size="icon" className="group h-7 w-7 cursor-pointer rounded-lg border-primary shadow-none hover:bg-primary lg:h-8 lg:w-8" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <Sun className="h-4 w-4 text-primary group-hover:text-white lg:h-5 lg:w-5" /> : <Moon className="h-4 w-4 text-primary group-hover:text-white lg:h-5 lg:w-5" />}
    </Button>
  );
};
