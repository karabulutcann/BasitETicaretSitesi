"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";

import { useState } from "react";
import Image from "next/image";
import { useDotButton } from "./carouselDotButton";
import { cn } from "@/lib/utils";

export default function ProductImageSlider({
  imageUrls,
  productName,
}: {
  imageUrls: string[];
  productName: string;
}) {
  const [api, setApi] = useState<CarouselApi>();

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);
  return (
<div className="md:h-screen h-full md:sticky md:top-6">
<div className="flex  md:h-[95%] h-full">
      <div className="pr-2 hidden md:flex flex-col ">
        {imageUrls.map((_, i) => (
          <button
            key={i}
            className={cn(" ", i === selectedIndex ? "" : "opacity-50")}
            onClick={() => onDotButtonClick(i)}
          >
            <Image
              src={imageUrls[i]}
              alt={productName}
              height={50}
              quality={1}
              priority={false}
              width={50}
            ></Image>
          </button>
        ))}
      </div>
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent className="h-full">
          {imageUrls.map((url, i) => {
            return (
              <CarouselItem key={i} className="h-full">
                <div className="relative h-full w-full">
                  <Image
                    src={url}
                    alt={productName}
                    fill
                    priority={i===0?true:false}
                    // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={100}
                    className="object-cover non-selectable "
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="mix-blend-difference">
          <CarouselPrevious />
        </div>
        <div className="mix-blend-difference">
          <CarouselNext />
        </div>
      </Carousel>
    </div>
</div>
  );
}
