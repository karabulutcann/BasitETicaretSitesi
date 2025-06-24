import { TH1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { House, PenLine, Plus, Trash2 } from "lucide-react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { addressSchema } from "@/db/schema";
import AddAddress from "../../../components/add_address";
import EditAddress from "@/components/edit_address";
import cities from "@/../public/locations.json"
import { Locations } from "@/types";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const addresses = await db.query.addressSchema.findMany({
    where: eq(addressSchema.userId, session.user?.id!),
  });

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <TH1 className="px-12">Adresler</TH1>
        <AddAddress buttonClassName="" isClient={false} callbackFn={undefined} cities={cities as Locations[]}></AddAddress>
      </div>
      <hr className="my-4" />
      <div className=" px-6">

        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-6">
            <span className="text-lg font-medium pb-4">Kayıtlı addres yok</span>
            <AddAddress buttonClassName="" isClient={false} callbackFn={undefined} cities={cities as Locations[]}></AddAddress>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {addresses.map((address, i) => {
              return (
                <div className="py-5 border px-6 rounded-xl" key={i}>
                  <div className="flex justify-between">
                    <div className="font-medium flex items-center text-lg ">
                      {" "}
                      <House className="mr-2 h-[24px]" /> {address.addressName}
                    </div>
                    <EditAddress buttonClassName="" address={address} isClient={false} callbackFn={undefined} ></EditAddress>
                  </div>

                  <div className="flex justify-between items-end pt-4 pb-2">
                    <div className=" text-sm">
                      {address.address}
                      <br />
                      {address.city} / {address.district}
                    </div>

                    <form action="/api/address/delete_address" method="POST">
                      <input
                        type="hidden"
                        name="addressId"
                        value={address.id}
                      />
                      <Button variant={"ghost"} size={"icon"} type="submit" >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
