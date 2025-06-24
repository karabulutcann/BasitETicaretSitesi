import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Category() {

  return (
    <div className="mt-8 md:grid-cols-2  md:grid-rows-12 grid gap-1 md:h-[900px] xl:h-[1200px] ">
      <div className=" h-full bg-neutral-200 relative md:row-span-8">
        <div className="absolute bottom-12 left-6 text-black text-5xl font-medium">
          Hoodiler
        </div>
      </div>
      <div className="grid gap-1 md:row-span-8">
        <div className="  bg-amber-400 relative">
          <div className="absolute bottom-12 left-6 text-black text-5xl font-medium">
            Tişörtler
          </div>
        </div>
        <div className=" bg-neutral-300 relative">
          <div className="absolute bottom-12 left-6 text-black text-5xl font-medium">
            Tişörtler
          </div>
        </div>
      </div>
      <div className=" h-full bg-fuchsia-600 relative md:col-span-2 md:row-span-4">
        <div className="absolute bottom-12 left-6 text-black text-5xl font-medium">
          Hoodiler
        </div>
      </div>
    </div>
  );
}
