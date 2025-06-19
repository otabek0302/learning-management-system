import { Logo } from "@/assets";

import Image from "next/image";
import Link from "next/link";

const NavigationLogo = () => {
  return (
    <Link href="/" className="relative h-12 w-12 cursor-pointer">
      <Image src={Logo} alt="Logo" fill priority className="object-contain" sizes="(max-width: 768px) 48px, 48px" />
    </Link>
  );
};

export default NavigationLogo;
