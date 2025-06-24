
import Image from "next/image";

export default function Header() {
  return (
    <div className="relative h-screen  flex flex-col justify-end
    lg:justify-center pl-6 lg:pl-16">
      <div className="font-black text-4xl lg:text-7xl uppercase ">
        New <br />
        Summer <br />season Drop
      </div>
      <div className="font-medium text-base lg:text-3xl  pt-8 ">
        For the people who know their taste
      </div>
      <Image className="h-full object-cover absolute top-0 left-0 w-full -z-10 hidden md:flex" src="/header-extended.png" alt="header photo" quality={100} width={4096} height={4096}></Image>
      <Image className="h-full object-cover absolute top-0 left-0 w-full -z-10  md:hidden" src="/img1.png" alt="header photo" quality={100} width={4096} height={4096}></Image>
    </div>
  );
}
