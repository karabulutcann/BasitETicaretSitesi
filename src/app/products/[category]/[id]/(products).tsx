"use client";

import { Check, ChevronDown, Grid2x2, Rows, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { Icons } from "@/components/icons";
import { Product } from "@/types/product";
import ProductCart from "@/components/product_cart";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export enum Siralama {
  one_cikan,
  azdan_coka,
  coktan_aza,
}

function FilterDrawer({
  children,
  buttonName,
}: {
  children: React.ReactNode;
  buttonName: string;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="text-xs">
          {buttonName} <ChevronDown className="ml-2 h-3 w-3" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
}

import * as Slider from "@radix-ui/react-slider";


const currecyFormatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' });

export default function Products({ products }: { products: Product[] }) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  const [siralama, setSiralama] = useState(Siralama.one_cikan);
  const [isLoading, setIsLoading] = useState(false);
  const [showAsGrid, setShowAsGrid] = useState(true);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div>
      <div className={""}>
        <div className="sm:block flex my-2 overflow-x-auto no-scrollbar px-2">
          <Button
            size="icon"
            variant="ghost"
            className=" lg:hidden p-2 mx-2"
            onClick={() => {
              setShowAsGrid(!showAsGrid);
            }}
          >
            {showAsGrid ? (
              <Rows className="h-[18px]"></Rows>
            ) : (
              <Grid2x2 className="h-[18px]"></Grid2x2>
            )}
          </Button>

          <FilterDrawer buttonName="Renk (2)">
            <div className="max-w-md mx-auto pb-6 flex flex-col items-center">
              <DrawerHeader>
                <DrawerTitle className="py-4 text-center">Renk</DrawerTitle>
              </DrawerHeader>
              <div className="grid grid-cols-4 gap-6 py-6">
                <div className="">
                  <input
                    id={"radio-"}
                    type="radio"
                    value={""}
                    name={"radio"}
                    className="peer/draft hidden"
                    // disabled={"b.stock" === 0}
                    // onChange={(e) => {
                    //   setSize("b.size");
                    // }}
                  />

                  <label
                    htmlFor={"radio-"}
                    className=" hidden peer-checked/draft:flex peer-checked/draft:border-[3px] border-white items-center justify-center h-[40px] w-[40px] bg-red-500 mx-auto"
                  >
                    <Check className="text-white"></Check>
                  </label>
                  <label
                    htmlFor={"radio-"}
                    className=" peer-checked/draft:hidden bg-red-500 "
                  >
                    <div className="h-[40px] w-[40px] bg-red-500 mx-auto"></div>
                  </label>
                  <div className="text-lg py-2">Kırmızı</div>
                </div>

                <div className="p-4 bg-green-500"></div>
                <div className="p-4 bg-blue-500"></div>
                <div className="p-4 bg-yellow-500"></div>
                <div className="p-4 bg-pink-500"></div>
                <div className="p-4 bg-purple-500"></div>
                <div className="p-4 bg-orange-500"></div>
                <div className="p-4 bg-teal-500"></div>
                <div className="p-4 bg-gray-500"></div>
              </div>
              <div className="py-12">
                <Button className="py-6 px-10" variant="outline">
                  Filteyi Temizle
                </Button>
              </div>
            </div>
          </FilterDrawer>

          <FilterDrawer buttonName="Beden">
            <div className="max-w-md mx-auto pb-6 flex flex-col items-center">
              <DrawerHeader>
                <DrawerTitle className="py-4 text-center">Beden</DrawerTitle>
              </DrawerHeader>
              <div className="grid grid-cols-4 gap-6 py-6">
                {sizes.map((b, i) => {
                  return (
                    <div className="" key={i}>
                      <input
                        id={"checkbox_size-" + i}
                        type="checkbox"
                        value={b}
                        name={"checkbox_size"}
                        className="peer/checkbox_size hidden"
                        // disabled={"b.stock" === 0}
                        // onChange={(e) => {
                        //   setSize("b.size");
                        // }}
                      />
                      <label
                        htmlFor={"checkbox_size-" + i}
                        className="peer-checked/checkbox_size:text-black peer-checked/checkbox_size:bg-white border h-[50px] w-[50px] flex items-center justify-center uppercase"
                      >
                        {b}
                      </label>
                    </div>
                  );
                })}
              </div>
              <div className="py-12">
                <Button className="py-6 px-10" variant="outline">
                  Filteyi Temizle
                </Button>
              </div>
            </div>
          </FilterDrawer>

          <FilterDrawer buttonName="Fiyat Aralığı">
            <div className="max-w-md mx-auto pb-6 flex flex-col items-center">
              <DrawerHeader>
                <DrawerTitle className="py-4 text-center pb-6">
                  Fiyat Aralığı
                </DrawerTitle>
              </DrawerHeader>
              <div className="flex items-center">
                <div className="w-[90px] text-center">{currecyFormatter.format(minPrice)}</div>
                <form className="px-6">
                  <Slider.Root
                    onValueChange={(value: number[]) => {
                      setMaxPrice(value[1]);
                      setMinPrice(value[0]);
                    }}
                    className="relative flex items-center select-none touch-none w-[250px] h-5"
                    defaultValue={[200, 1800]}
                    max={20000}
                    step={100}
                  >
                    <Slider.Track className="bg-blackA7 relative grow rounded-full h-[3px]">
                      <Slider.Range className="absolute bg-white rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb
                      className="block w-5 h-5 bg-white rounded-[10px] hover:bg-violet3 focus:outline-none "
                      aria-label="Volume"
                    />
                    <Slider.Thumb
                      className="block w-5 h-5 bg-white  rounded-[10px] hover:bg-violet3 focus:outline-none"
                      aria-label="Volume"
                    />
                  </Slider.Root>
                </form>
                <div>{currecyFormatter.format(maxPrice)}</div>
              </div>

              <div className="py-12">
                <Button className="py-6 px-10" variant="outline">
                  Filteyi Temizle
                </Button>
              </div>
            </div>
          </FilterDrawer>
          <FilterDrawer buttonName="Sıralama">a</FilterDrawer>
          <FilterDrawer buttonName="Kesim">a</FilterDrawer>
        </div>
      </div>

        <div
          className={
            "grid lg:grid-cols-3 gap-x-1  " +
            (showAsGrid ? " max-lg:grid-cols-2" : " grid-cols-1")
          }
        >
          {products !== undefined && products?.length === 0 && !isLoading ? (
            <div className="text-3xl uppercase p-4 mt-8 h-[300px]">
              Ürün bulunamadı
            </div>
          ) : (isLoading ? (
              <div className="w-full flex items-center justify-center p-8 ">
                Yükleniyor...{" "}
                <Icons.spinner className="ml-4  h-6 w-6 animate-spin" />
              </div>
            ) : (
              products?.map((p, i) => {
                return (
                  <div key={i}>
                    <ProductCart
                      product={p}
                    ></ProductCart>
                  </div>
                )}
            ))
          )}
        </div>
      
    </div>
  );
}
