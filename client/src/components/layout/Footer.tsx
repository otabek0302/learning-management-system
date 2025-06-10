"use client";

import { Github, Instagram, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register" || pathname === "/verification") return null;

  return (
    <footer>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center justify-between gap-6 border-t border-border py-3 md:flex-row">
          <div className="flex flex-col items-center justify-start gap-4 md:flex-row md:justify-center">
            <a href="/terms-and-condition" className="text-xs text-gray-400 transition hover:text-primary md:text-sm">
              {t("components.footer.terms-and-condition")}
            </a>
            <a href="/privacy-policy" className="text-xs text-gray-400 transition hover:text-primary md:text-sm">
              {t("components.footer.privacy-policy")}
            </a>
            <a href="/cookies" className="text-xs text-gray-400 transition hover:text-primary md:text-sm">
              {t("components.footer.cookies")}
            </a>
          </div>

          <div className="flex justify-center gap-2 md:gap-4">
            <a href="mailto:otabekjon0302@gmail.com" rel="noreferrer" target="_blank" className="group flex h-7 w-7 items-center justify-center rounded-lg border border-primary hover:bg-primary lg:h-8 lg:w-8">
              <span className="sr-only">Mail</span>
              <Mail className="size-3.5 text-primary group-hover:text-white" />
            </a>

            <a href="https://www.instagram.com/otabek_03.02" rel="noreferrer" target="_blank" className="group flex h-7 w-7 items-center justify-center rounded-lg border border-primary hover:bg-primary lg:h-8 lg:w-8">
              <span className="sr-only">Instagram</span>
              <Instagram className="size-3.5 text-primary group-hover:text-white" />
            </a>

            <a href="https://github.com/otabek0302" rel="noreferrer" target="_blank" className="group flex h-7 w-7 items-center justify-center rounded-lg border border-primary hover:bg-primary lg:h-8 lg:w-8">
              <span className="sr-only">GitHub</span>
              <Github className="size-3.5 text-primary group-hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
