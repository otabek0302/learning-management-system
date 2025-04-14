import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <div className="relative">
        <Input id="search" placeholder="Type to search..." className="h-10 pl-7 focus-visible:ring-0" />
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </div>
    </form>
  );
}
