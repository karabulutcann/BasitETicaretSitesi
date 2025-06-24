import Link from "next/link";
import NavCart from "./nav_cart";
import NavMobile from "./nav_mobile";
import { Button } from "@/components/ui/button";
import Logo from "../../../public/sWhite.svg";
import Image from "next/image";
import dynamic from "next/dynamic";

const UserNav = dynamic(() => import("./user_nav"));

export default async function Nav() {
  return (
    <>
    <div className="bg-lime-600 h-[48px] flex justify-center items-center font-medium text-black">
      5000 TL üzeri siparişlerde kargo bedava 
    </div>
      <nav
        className={
          "sticky top-[4px] z-30  py-3 lg:py-2 flex justify-between items-center w-full px-2 sm:px-4 xl:px-8  "
        }
      >
        <Link
          href="/"
          className={"uppercase text-lg font-bold px-2 items-center flex  "}
        >
          <Image src={Logo} alt="logo" width={42} height={42}></Image>
        </Link>
        <div className="hidden lg:flex">
          <Link href="/products/tum-urunler/a0">
            <Button variant="link">Tüm Ürünler</Button>
          </Link>
          <Link href="/products/indirimde/a1">
            <Button variant="link">İndirimde</Button>
          </Link>
          <Link href="/products/tum-urunler/0">
            <Button variant="link">Tişörtler</Button>
          </Link>
          <Link href="/products/tum-urunler/0">
            <Button variant="link">Hoodiler</Button>
          </Link>
          <Link href="/products/tum-urunler/0">
            <Button variant="link">Eşofmanlar</Button>
          </Link>
        </div>
        <div className="flex items-center">
          <UserNav></UserNav>
          <NavCart></NavCart>
          <NavMobile></NavMobile>
        </div>
      </nav>
      </>
  );
}
