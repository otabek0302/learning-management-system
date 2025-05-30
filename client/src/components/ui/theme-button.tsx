import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer shadow-none lg:h-9 lg:w-9" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <Sun className="h-4 w-4 text-primary lg:h-5 lg:w-5" /> : <Moon className="h-4 w-4 text-primary lg:h-5 lg:w-5" />}
    </Button>
  );
};
