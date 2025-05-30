import { Logo } from "@/assets";

import Image from "next/image";

const NavigationLogo = () => {
  return (
    <div className="relative h-12 w-12">
      <Image src={Logo} alt="Logo" fill priority className="object-contain" sizes="48px" />
    </div>
  );
};

export default NavigationLogo;
