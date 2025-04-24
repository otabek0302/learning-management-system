import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DarkMode = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button variant="outline" size="icon" iconSize="md" className="h-8 w-8 md:w-9 md:h-9 cursor-pointer shadow-none" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <Sun className="text-primary" /> : <Moon className="text-primary" />}
    </Button>
  );
};
