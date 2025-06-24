import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckIcon } from "lucide-react";
import Link from "next/link";
import ClearLocalStorage from "./clear_local_storage";

export default function Page({
  searchParams,
}: {
  searchParams: { orderNumber: string; email: string };
}) {
  return (
    <div className="h-screen flex justify-center items-center">
      <ClearLocalStorage />
      <div className="flex flex-col items-center">
        <div className="border-2 border-green-700 rounded-full mb-6">
          <CheckIcon className="h-[48px] w-[48px] m-4 text-green-700"></CheckIcon>
        </div>
        <div className="font-medium text-2xl pb-12">Siparişiniz Tamamlandı</div>
        <div className=" text-gray-400 max-w-2xl text-center">
          Teşekkür ederiz! Siparişiniz başarıyla alındı ve işleme koyuldu.
          Sipariş numaranız {searchParams.orderNumber} olup, en kısa sürede
          tarafınıza kargo bilgileri iletilecektir. Siparişinizin durumunu
          hesabınızdan takip edebilir, herhangi bir sorunuz olduğunda müşteri
          hizmetlerimizle iletişime geçebilirsiniz. Bizi tercih ettiğiniz için
          teşekkür eder, keyifli alışverişler dileriz!
        </div>
        <Button className="mt-6" variant={"link"}>
          <Link
            href={
              "/trackorder/order_detail?orderNumber=" +
              searchParams.orderNumber +
              "&email=" +
              searchParams.email
            }
            className="flex items-center"
          >
            Sipariş detay sayfasına git{" "}
            <ArrowUpRight className="ml-2"></ArrowUpRight>
          </Link>
        </Button>
        <Button className="mt-6" variant={"link"}>
          <Link href="/" className="flex items-center">
            Ana Sayfaya Git <ArrowUpRight className="ml-2"></ArrowUpRight>
          </Link>
        </Button>
      </div>
    </div>
  );
}
