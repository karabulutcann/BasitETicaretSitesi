import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import FormVerify from "./form";

export default function Page() {
  const userDataToken = cookies().get("userDataToken")?.value;

  if (!userDataToken) {
    redirect("/auth/signup");
  }

  const userData = jwt.verify(userDataToken!, process.env.JWT_SECRET!) as {
    email: string;
    name: string;
    surname: string;
    password: string;
  };


  return (
      <FormVerify userData={userData}></FormVerify>
  );
}
