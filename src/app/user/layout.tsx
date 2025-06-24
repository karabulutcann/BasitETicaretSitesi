import { Button } from "@/components/ui/button";
import { MapPin, ShoppingBag, User, User2 } from "lucide-react";
import Link from "next/link";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex pt-[90px] max-w-[1280px] mx-auto lg:px-6">
      <div className="sm:max-lg:absolute sm:max-lg:top-0 sm:max-lg:left-1/2 sm:max-lg:-translate-x-1/2 flex   max-sm:justify-center lg:flex-col lg:pt-20 z-50">
        <Link href="/user/profile">
          <Button variant="link" className="flex p-4 my-4">
            <User2></User2>
            <span className="ml-3 max-sm:text-xs">Hesap</span>
          </Button>
        </Link>
        <Link href="/user/addresses">
          <Button variant="link" className=" flex p-4 my-4">
            {" "}
            <MapPin />
            <span className="ml-3 max-sm:text-xs">Adresler</span>
          </Button>
        </Link>
        <Link href="/user/orders">
          <Button variant="link" className="flex p-4 my-4">
            {" "}
            <ShoppingBag />
            <span className="ml-3 max-sm:text-xs">Siparişler</span>
          </Button>
        </Link>
      </div>
      <div className="grow py-6  px-3">{children}</div>
    </div>
  );
}
