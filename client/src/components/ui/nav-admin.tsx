"use client";
import Link from "next/link";

import { Shield } from "lucide-react";

import { Button } from "./button";

export function NavAdmin() {
  return (
    <Button variant="outline" size="icon" className="group h-7 w-7 cursor-pointer rounded-lg border-primary bg-primary shadow-none hover:bg-primary/90 lg:h-8 lg:w-8" >
      <Link href="/admin">
        <Shield className="h-4 w-4 text-primary-foreground group-hover:text-white lg:h-5 lg:w-5" />
      </Link>
    </Button>
  );
}
