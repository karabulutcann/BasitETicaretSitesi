import { Pocket, RefreshCcw, Truck } from "lucide-react";

export default function Stats() {
  return (
    <div className="py-4 flex flex-col md:flex-row items-center md:justify-center">
      <div className="flex items-center justify-center flex-col py-16 w-[200px] md:mx-12 lg:mx-24 flex-none">
        <Truck className="h-[24px] w-[24px] m-4"></Truck>
        <h2 className="font-medium uppercase text-center">
          kapıda ödeme
        </h2>
        <p className=" text-center pt-2  text-xs sm:text-sm text-white/75">
          tüm ürünlerde kapıda ödeme seçeneği
        </p>
      </div>
      <div className="flex items-center justify-center flex-col  w-[200px] md:mx-12 lg:mx-24 flex-none py-16">
        <RefreshCcw className="h-[24px] w-[24px] m-4"></RefreshCcw>
        <h2 className="font-medium uppercase text-center">
          15 gün içinde iade
        </h2>
        <p className=" text-center pt-2 text-xs sm:text-sm text-white/75">
          aldığınız ürünleri 15 içinde dilediğiniz gibi iade edebilirsiniz
        </p>
      </div>
      <div className="flex items-center justify-center flex-col w-[200px] md:mx-12 lg:mx-24 flex-none py-16">
        <Pocket className="h-[24px] w-[24px] m-4"></Pocket>
        <h2 className="font-medium uppercase text-center">
          İyzico ile güvende
        </h2>
        <p className=" text-center pt-2 text-xs sm:text-sm text-white/75">
          İyzico ile güvenle alışveriş yapabilirsiniz
        </p>
      </div>
    </div>
  );
}
