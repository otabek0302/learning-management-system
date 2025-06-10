import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
}
