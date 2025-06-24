
import { TH1, TH2 } from "@/components/typography";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { db } from "@/db";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { orderSchema } from "@/db/schema";
import { eq } from "drizzle-orm";


export default async function Page() {

  try {
    const session = await auth();

    if (!session) {
      redirect("/auth/signin");
    }
    const data = await db.query.orderSchema.findMany({
      where: eq(orderSchema.userId, session.user?.id!),
      with: {
        address: true,
      },
    });
    console.log(data);
    return (
      <div className="">
        <div className="flex items-center justify-between">
        <TH1 className="px-12">Siparişler</TH1>
        </div>
        <hr className="my-4" />
        <div className="pt-6 px-6">
        <DataTable columns={columns} data={data} />
        </div>
      </div>
    );
   

  } catch (error) {
    console.log(error);
  }
}



