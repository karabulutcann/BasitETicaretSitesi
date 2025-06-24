import Category from "./(home)/category";
import Header from "./(home)/header";
import NewArrived from "./(home)/new_arrived";
import Stats from "./(home)/stats";
import dynamic from "next/dynamic";

const Featured = dynamic(() => import("./(home)/featured"));

export default async function Home() {
  return (
    <div className="flex flex-col gap-y-20 lg:gap-y-24 xl:gap-y-32">
            <Header></Header>
        <NewArrived header={"Yeni Gelenler"}></NewArrived>
        <NewArrived header={"İndirimde"}></NewArrived>
         <Category></Category>
    </div>
  )
}
