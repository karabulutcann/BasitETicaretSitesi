import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import {  Menu } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const UserNav = dynamic(() => import("./user_nav_mobile"));

export default function NavBar(params: {  }) {

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-1 lg:hidden">
          <Menu className=""></Menu>
        </Button>
      </SheetTrigger>
      <SheetContent
        className={"p-0 border-0 min-[320px]:w-[320px] px-4  "}
        side="right"
      >
        <Link href="/" className=" absolute m-2 left-4 top-4 p-1 ">
          <SheetClose className="uppercase text-lg font-bold">
            LoremIpsum
          </SheetClose>
        </Link>
        <div className="flex flex-col justify-between h-full">
          <div className="px-2 pt-28 grid gap-y-2 font-semibold text-2xl  ">
            <Link href="/products/">
              <SheetClose className="w-full py-1 hover:underline text-start">
                Ana Sayfa
              </SheetClose>
            </Link>
            <Link href="/products/tum-urunler/a0">
              <SheetClose className="w-full  py-1  hover:underline text-start">
                Tüm Ürünler
              </SheetClose>
            </Link>
            <Link href="/products/indirimde/a1">
              <SheetClose className="w-full  py-1  hover:underline text-start">
                İndirimde
              </SheetClose>
            </Link>
            <Link href="/products/">
              <SheetClose className="w-full  py-1  hover:underline text-start">
                Hoodieler
              </SheetClose>
            </Link>
            <Link href="/products/">
              <SheetClose className="w-full  py-1  hover:underline text-start">
                Tisörtler{" "}
              </SheetClose>
            </Link>
            <Link href="/products/">
              <SheetClose className="w-full  py-1 hover:underline text-start">
                Droplar
              </SheetClose>
            </Link>
          </div>
          <div className="flex justify-between items-center px-2 left-0 py-12 font-semibold text-lg w-full">
         <UserNav></UserNav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
