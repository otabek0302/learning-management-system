"use client";

import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register" || pathname === "/verification") return null;

  return (
    <div>
      <h1>Footer</h1>
    </div>
  );
};

export default Footer;
