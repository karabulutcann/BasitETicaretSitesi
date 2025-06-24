import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckIcon, CircleAlert } from "lucide-react";
import Link from "next/link";

export default function Page({
  searchParams,
}: {
  searchParams: { err: string };
}) {
  let errorMessage: string = "Ödeme alınamadı, beklenmedik bir hata oluştu";

  switch (searchParams.err) {
    case "10005": {
      errorMessage = "Ödeme işlemi sırasında hata oluştu";
      break;
    }
    case "10012": {
      errorMessage = "Ödeme işlemi sırasında hata oluştu";
      break;
    }
    case "10051": {
      errorMessage = "Kart limiti yetersiz, yetersiz bakiye";
      break;
    }
    case "10054": {
      errorMessage = "Son kullanma tarihi hatalı. Kartınızın vadesi dolmuştur.";
      break;
    }
    case "10057": {
      errorMessage = "Kartınız bu işlem için kısıtlıdır";
      break;
    }
    case "10084": {
      errorMessage = "Girilen CVV değeri hatalı veya geçersiz.";
      break;
    }
    case "10093": {
      errorMessage =
        "Kartınız internetten alışverişe kapalıdır. Açtırmak için Bankanız ile irtibata geçebilirsiniz.";
      break;
    }
    case "10201": {
      errorMessage = "Kart işleme izin vermedi";
      break;
    }
    case "10209": {
      errorMessage = "Bloke statülü kart, bankanız ile irtibata geçiniz.";
      break;
    }
    case "10210": {
      errorMessage = "Hatalı CVC bilgisi, tekrar deneyiniz.";
      break;
    }
    case "10212": {
      errorMessage =
        "CVC yanlış girme deneme sayısı aşıldı, bankanız ile irtibata geçiniz.";
      break;
    }
    case "10216":
    case "10214":
    case "10219":
    case "10228":
      errorMessage =
        "Banka tarafında hata oluştu, daha sonra tekrar deneyiniz.";
      break;

    case "10215": {
      errorMessage =
        "Geçersiz kart, hatalı kart, kart numaranızı kontrol ediniz.";
      break;
    }
    case "10215": {
      errorMessage =
        "Geçersiz kart, hatalı kart, kart numaranızı kontrol ediniz.";
      break;
    }
    case "10218": {
      errorMessage = "Banka kartları ile taksit yapılamaz, tekrar deneyiniz.";
      break;
    }
    case "10220": {
      errorMessage =
        "Ödeme alınamadı tekrar deneyiniz, hata alınması durumunda bankanız ile irtibata geçiniz.";
      break;
    }
    case "10221": {
      errorMessage = "Yurtdışı kartlara işlem izni bulunmamaktadır";
      break;
    }
    case "10222": {
      errorMessage = "Pos taksitli işleme kapalıdır";
      break;
    }
    case "10224": {
      errorMessage = "Kartınızın para çekme limiti aşılmıştır";
      break;
    }
    case "10225": {
      errorMessage = "Kartınız bu işlem için kısıtlıdır";
      break;
    }
    case "10229": {
      errorMessage = "Kartın son kullanma tarihi hatalıdır, tekrar deneyiniz.";
      break;
    }
    case "10230": {
      errorMessage =
        "Ödeme isteği banka tarafından bloklandı, bankanız ile irtibata geçiniz.";
      break;
    }
    case "10240": {
      errorMessage = "Gönderilen istek zaman aşımına uğradı";
      break;
    }
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className=" mb-3 ">
          <CircleAlert className="h-[64px] w-[64px] m-4 text-destructive"></CircleAlert>
        </div>
        <div className=" text-xl pb-12">Ödeme Kabul edilmedi</div>
        <div className=" text-gray-400 max-w-2xl text-center leading-loose">
          {/* hata paragrafı */}Lütfen ödeme bilgilerinizin doğru olduğundan
          emin olun ve işlemi tekrar deneyin. Sorun devam ederse, bankanız ile
          iletişime geçerek daha fazla yardım alabilirsiniz.
          Hata mesajı: {errorMessage}
        </div>
        <Button className="mt-3" variant={"link"}>
          <Link href={"/checkout"} className="flex items-center text-base">
            Tekrar dene <ArrowUpRight className="ml-2"></ArrowUpRight>
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
