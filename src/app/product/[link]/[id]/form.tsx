"use client";

import {
  IsOpenDispatchContext,
  addToCartDispatch,
  localAddToCartDispatch,
  useCartDispatcher,
} from "@/app/cart";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

import { useContext, useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Chart, ProductSize, SizeChart } from "@/db/schema";
import { Product } from "@/types/product";
import { AlertDestructive } from "@/components/alert";
import { baseUrl } from "@/local.env";
import {
  GetAllProductSizesRequest,
  GetAllProductSizesResponse,
} from "@/app/api/product/get_all_product_sizes/route";

export default function Form({
  product,
  sizeChart,
}: {
  product: Product;
  sizeChart: SizeChart;
}) {
  const session = useSession();
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
  const [sizeIndex, setSizeIndex] = useState<number>(-1);
  const [sizeError, setSizeError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isOpenDispacher = useContext(IsOpenDispatchContext);
  const cartDispatch = useCartDispatcher();

  useEffect(() => {
    setIsLoading(true);
    console.log(baseUrl + "/api/product/get_all_product_sizes");
    fetch(baseUrl + "/api/product/get_all_product_sizes", {
      method: "POST",
      body: JSON.stringify({
        productId: product.id,
      } as GetAllProductSizesRequest),
    })
      .then((r) => {
        setIsLoading(false);
        if (r.ok) {
          return r.json();
        } else {
          setFetchStatus(500);
          throw new Error("Bir hata oluştu");
        }
      })
      .then((r: GetAllProductSizesResponse) => {
        setProductSizes(r.productSizes);
      });
  }, []);

  useEffect(() => {
    if (session.status !== "loading") {
      setIsLoading(false);
    }
  }, [session]);

  return (
    <form method="POST" className="pb-12 pt-8 border-t">
      <div className="pb-12 ">
        <div className="flex items-center justify-between mb-2">
          <div
            className={
              "font-medium" + " " + (fetchStatus === 400 && "text-red-500")
            }
          >
            Beden Seç
          </div>
          <div
            className="text-sm hover:underline font-medium hover:bg-accent hover:text-accent-foreground py-2 px-3 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            beden tablosu
          </div>
        </div>
        <div className=" ">
          {productSizes.length === 0 ? (
            <div>
              <Icons.spinner className="animate-spin h-8 m-4 w-8 mx-auto"></Icons.spinner>
            </div>
          ) : (
            productSizes!.map((b, i) => {
              return (
                <div key={i} className=" py-2 px-2 inline-block">
                  <input
                    id={"radio-" + b.size}
                    type="radio"
                    value={b.size}
                    name={"radio"}
                    className="peer/draft hidden"
                    disabled={b.stock === 0}
                    onChange={(e) => {
                      setSizeIndex(i);
                      setFetchStatus(0);
                      setSizeError("");
                    }}
                  />
                  <label
                    htmlFor={"radio-" + b.size}
                    className="cursor-pointer transition-all ease-out  border shrink uppercase font-semibold 
                    h-[50px] w-[50px] flex items-center justify-center peer-checked/draft:bg-primary
                     peer-checked/draft:text-black peer-disabled/draft:text-white/10 peer-disabled/draft:cursor-not-allowed"
                  >
                    {b.size}
                  </label>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className=" w-full ">
        {fetchStatus === 245 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription={
              "Sepete daha fazla " + sizeError + " beden ekleyemezsin"
            }
          />
        )}
        {fetchStatus === 246 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription={sizeError + "bedeni stokta yok"}
          />
        )}
        {fetchStatus === 400 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Lütfen bir beden seçin"
          />
        )}
        {fetchStatus === 500 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Sunucuda bir hata oluştu"
          />
        )}

        <Button
          disabled={isLoading}
          variant="default"
          className=" py-8 px-3 w-full flex"
          onClick={(e) => {
            e.preventDefault();
            setIsLoading(true);

            if (session.status === "authenticated") {
              setSizeError(productSizes[sizeIndex].size);
              addToCartDispatch(
                cartDispatch,
                productSizes[0].productId,
                productSizes[sizeIndex].size,
                (status: number) => {
                  setIsLoading(false);
                  setFetchStatus(status);
                  
                  if (status === 200) isOpenDispacher();
                },
              );
            } else {
              localAddToCartDispatch(
                cartDispatch,
                product,
                productSizes[sizeIndex],
                productSizes[sizeIndex].size,
                (status: number) => {
                  setIsLoading(false);
                  setFetchStatus(status);
                  if (status === 200) isOpenDispacher();
                },
              );
            }
          }}
        >
          {isLoading ? (
            <Icons.spinner className="animate-spin"></Icons.spinner>
          ) : (
            <span>Sepete Ekle</span>
          )}
        </Button>

        <Button
          variant="secondary"
          className={"w-full py-8 mt-4 "}
        >
          {" "}
          Şimdi Satın Al
        </Button>
        <SizeChartDialog
          sizeChart={sizeChart}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </form>
  );
}

function SizeChartDialog({
  sizeChart,
  isOpen,
  setIsOpen,
}: {
  sizeChart: SizeChart;
  isOpen: boolean;
  setIsOpen: any;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={"w-full py-8 mt-4 "}
        >
          Beden Tablosu
        </Button>
      </DialogTrigger>
      <DialogContent className=" overflow-scroll h-[80vh]  max-w-4xl xl:w-9/12 2xl:w-4/6 max-sm:p-2 ">
        <DialogHeader  >
          <DialogTitle>
            Beden Tablosu
          </DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 grid-row-2 py-2 gap-6">
          <div className="flex flex-col items-center px-4 my-4">
            <Image
              src={sizeChart.sizeChartImage!}
              alt="chart"
              width={400}
              height={400}
            ></Image>
            <Table className=" text-xs md:text-sm col-span-2 my-4">
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="">Gövde En (cm)</TableHead>
                  <TableHead className="text-center ">Gövde Boy (cm)</TableHead>
                  <TableHead className="text-center ">Kol Boy (cm)</TableHead>
                  <TableHead className="text-center ">Kol En (cm)</TableHead>
                  <TableHead className="text-center ">Sırt En (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center px-0">Beden</TableHead>
                  <TableHead className="text-center">A</TableHead>
                  <TableHead className="text-center">B</TableHead>
                  <TableHead className="text-center">C</TableHead>
                  <TableHead className="text-center">D</TableHead>
                  <TableHead className="text-center">E</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(sizeChart.chart as Chart[]).map((sizes) => (
                  <TableRow key={sizes.size}>
                    <TableCell className="text-right bg-secondary ">
                      {sizes.size}:
                    </TableCell>
                    <TableCell className="text-center">{sizes.A}</TableCell>
                    <TableCell className="text-center">{sizes.B}</TableCell>
                    <TableCell className="text-center">{sizes.C}</TableCell>
                    <TableCell className="text-center">{sizes.D}</TableCell>
                    <TableCell className="text-center">{sizes.E}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="sm:grid sm:grid-cols-2 py-4">
            <div>
              <div className="font-medium pt-2">1. Göğüs</div>
              <div className="text-sm py-2">
                Mezurayı göğsünüzün üzerinde en geniş noktasına yerleştirerek,
                gögüsünüzün çevresi için ölçüm yapın.
              </div>
            </div>
            <div>
              <div className="font-medium pt-2">2. Bel</div>
              <div className="text-sm py-2">
                Ellerinizi belinize koyun. Elinizin bulunuduğu nokta bel
                noktanızdır. O noktadan belinizin çevresini ölçün.
              </div>
            </div>
            <div>
              <div className="font-medium pt-2">3. Basen</div>
              <div className="text-sm py-2">
                Mezurayı kalçanızın en geniş yerine yerleştirerek, baseninizin
                çevresini ölçün.
              </div>
            </div>

            <div>
              <div className="font-medium pt-2">4. İç Bacak Boyu</div>
              <div className="text-sm py-2">
                Bacak içini en üst çatal noktasından bilek kemiğine kadar ölçün.
              </div>
            </div>

            <div className="col-span-2">
              <div className="font-medium pt-2">5. Beden Boyu</div>
              <div className="text-sm py-2">
                Boyunuzu ayaklarınız çıplakken, düz bir zemin üzerinde, zeminden
                başınızın en üst noktasına kadar ölçmelisiniz. Genişlik
                ölçülerinizi ölçerken mezurayı düz tutmaya; yere paralel olacak
                şekilde, kaydırmamaya dikkat etmelisiniz. Ölçü alırken kendinizi
                rahat bırakmalı, nefesinizi tutmamalı ve göğüs kafesini
                şişirmeden ölçü almalısınız.
              </div>
            </div>
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
