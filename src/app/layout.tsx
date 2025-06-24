import "./globals.css";

import type { Metadata, Viewport } from "next";

import Nav from "./(nav)/nav";
import Footer from "./footer";

export const metadata: Metadata = {
  title: "En Son Moda Giyim | LoremIpsum",
  description:
    "Son moda giyim ürünleri ve tarzlarını keşfedin. En iyi fiyatlar ve geniş ürün yelpazesiyle alışveriş yapın.",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

import dynamic from "next/dynamic";
import { chillax } from "./fonts";

const Contexts = dynamic(() => import("./contexts"));
import { SessionProvider } from "next-auth/react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
4
  return (
    <html lang="tr" className={`${chillax.className}`}>
      <body>
        <SessionProvider>
          <Contexts>
            <Nav></Nav>
            <main className="">{children}</main>
          </Contexts>
        </SessionProvider>
        <Footer></Footer>
      </body>
    </html>
  );
}
