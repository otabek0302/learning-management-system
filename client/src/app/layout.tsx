import { Poppins } from "next/font/google";
import { DefaultSeo } from "next-seo";
import { Providers } from "./providers";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

<DefaultSeo
  title="Learning Management System"
  description="A modern LMS platform to manage your courses and users."
  openGraph={{
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com/",
    site_name: "Learning Management System",
  }}
/>;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B5FFE " />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
