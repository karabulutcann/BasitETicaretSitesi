"use client";

import Link from "next/link";
import {
    SheetClose,
  } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Box, MapPin, ShoppingBag, User, User2, UserPlus2, } from "lucide-react";

import { useSession } from "next-auth/react";

export default function UserNavMobile() {
    const session = useSession();
    return <>
       {session.status !== "authenticated" ? (
              <div className="flex flex-col space-y-4 font-medium">
                <Link href="/auth/signin">
                  <SheetClose className="hover:underline flex"> <User2 className="mr-2"></User2> Giriş Yap</SheetClose>
                </Link>
                <Link href="/auth/signup">
                  <SheetClose className="hover:underline flex"><UserPlus2 className="mr-2"></UserPlus2>Kaydol</SheetClose>
                </Link>
                <Link href="/trackorder">
                    <SheetClose className=" hover:underline flex">
                      <Box className="mr-2"></Box> Siparişlerim
                    </SheetClose>
                  </Link>
                  <Link href="/user">
                    <SheetClose className="hover:underline flex">
                      <ShoppingBag className="mr-2" /> Sepetim
                    </SheetClose>
                  </Link>
              </div>
            ) : (
              <div className="flex flex-col items-start">
                <Button variant="link" className=" hover:underline text-start">
                  <Link href="/user/profile">
                    <SheetClose className="flex ">
                      <User2 className="mr-2"></User2>Hesap
                    </SheetClose>
                  </Link>
                </Button>
                <Button variant="link" className=" hover:underline text-start">
                  <Link href="/cart">
                    <SheetClose className="flex">
                      <ShoppingBag className="mr-2" /> Sepetim
                    </SheetClose>
                  </Link>
                </Button>
                <Button variant="link" className=" hover:underline text-start">
                  <Link href="/user/addresses">
                    <SheetClose className="flex">
                      <MapPin className="mr-2"></MapPin> Adreslerim
                    </SheetClose>
                  </Link>
                </Button>
                <Button variant="link" className=" hover:underline text-start">
                  <Link href="/user/orders">
                    <SheetClose className="flex">
                      <Box className="mr-2"></Box> Siparişlerim
                    </SheetClose>
                  </Link>
                </Button>
              </div>
            )}
    </>;
}