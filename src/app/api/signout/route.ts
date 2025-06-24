import { ProductSize, productSizeSchema } from "@/db/schema";
import { signOut } from "../../../auth";

export async function POST(req: Request) {
  await signOut({
    redirect: true,
  });
}
