import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewsLetter() {
  return (
    <div className="bg-lime-500 flex justify-center">
      <div className="py-20 p-8  max-w-xl">
        <div className="font-black text-4xl">E-BÜLTEN</div>
        <div className="font- text-lg pt-2 ">
          İndirimlerden ve yeni ürünlerden haberdar olmak için e bültene katıl
        </div>
        <form action="" className="pt-6">
          <Label htmlFor="email" className="text-lg">
            Email
          </Label>
          <Input type="email" className="border-2 border-primary"></Input>
          <Button variant="default" className="mt-2 w-full py-6">
            Abone Ol
          </Button>
        </form>
        <div className="text-sm pt-4 tracking-wide leading-snug px-1">
          Kampanya, ürün ve yeniliklerden haberdar edilmek için tarafıma e-posta
          ve/veya SMS gönderilmesine açık rızamla izin veriyorum. E-posta
          adresin, e-bülten üyesi olarak kampanya, ürün ve yeniliklerden
          haberdar edilebilmen için alınmaktadır. Kişisel verilerin işlenmesi
          ile ilgili detaylı bilgiye{" "}
          <span className="underline text-indigo-900">buradan</span>{" "}
          ulaşabilirsin.
        </div>
      </div>
    </div>
  );
}
