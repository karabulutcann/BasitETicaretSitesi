import { Facebook, Instagram } from "lucide-react";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import Stats from "./(home)/stats";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-zinc-400 hover:text-white hover:underline leading-none"
    >
      {children}
    </Link>
  );
}

export default function Page() {
  return (
    <footer className="h-full flex flex-col justify-center items-center pt-4 max-sm:pt-[48px] ">
      <Stats />
      <div className="py-24 lg:py-48 w-full grid sm:grid-cols-2 gap-y-16 lg:grid-cols-2 2xl:grid-cols-4 sm:justify-between px-10 text-sm ">
        <div className="max-sm:pb-12 grid gap-y-4">
          <div className={"font-medium uppercase text-base pb-2 "}>
            SEKMELER
          </div>
          <FooterLink href={"/"}>Ana Sayfa</FooterLink>
          <FooterLink href={"/collections"}>Koleksiyonlar</FooterLink>
          <FooterLink href={"/products/tum-urunler/0"}>Tüm Ürünler</FooterLink>
          <FooterLink href={"/urunler/hoodiler/1"}>Hoodieler</FooterLink>
          <FooterLink href={"/urunler/tisortler/2"}>Tişörtler</FooterLink>
        </div>
        <div className="max-sm:pb-12 grid gap-y-4">
          <div className={"font-medium uppercase text-base pb-2 "}>Yardım</div>
          <FooterLink href={"/trackorder"}>Sipariş Takipi</FooterLink>
          <FooterLink href={"/kargo-ve-teslimat"}>Kargo ve Teslimat</FooterLink>
          <FooterLink href={"/iade-degisim"}>İade ve Değişim</FooterLink>
          <FooterLink href={"/odeme-yontemleri"}>Ödeme Yöntemleri</FooterLink>
          <FooterLink href={"/iletisim"}>İletişim</FooterLink>
        </div>
        <div className="max-sm:pb-12 grid gap-y-4">
          <div className={"font-medium uppercase text-base pb-2 "}>
            Politikalar
          </div>
          <FooterLink href={"/yardim/kvkk_gizlilik"}>
            KVKK ve Gizlilik Politikası
          </FooterLink>
          <FooterLink href={"/kullanim-sozlesmesi"}>
            Kullanım Sözleşmesi
          </FooterLink>
          <FooterLink href={"/yardim/mesafeli-satis"}>
            Mesafeli Satış Sözleşmesi
          </FooterLink>
          <FooterLink href={"/yardim/iade_degisim"}>
            İade ve Değişim Şartları
          </FooterLink>
          <FooterLink href={"/aydinlatma-metni"}>Aydınlatma Metni</FooterLink>
        </div>
        <div className="max-sm:pb-12 grid gap-y-4">
          <div className={"font-medium uppercase text-base pb-2"}>
            Bize Ulaşın
          </div>
          <div className="text-zinc-400 pb-2">Eposta: the@LoremIpsum.store</div>
          <div className="text-zinc-400">Telefon: +90 (250) 200 21 30</div>
          <div className={"font-medium uppercase text-lg pt-12"}>SocIal</div>
          <div className="flex text-zinc-400 mt-4 ">
            {" "}
            <Button variant="ghost" size="icon">
              <Link href={"#"}>
                <Instagram></Instagram>
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Facebook></Facebook>
            </Button>
          </div>
        </div>
      </div>
      <div className="text-sm py-4 tracking-wide text-zinc-400">
        © 2024, LoremIpsum. Tüm Hakları Saklıdır
      </div>
    </footer>
  );
}
