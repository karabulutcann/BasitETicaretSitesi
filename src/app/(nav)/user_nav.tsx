"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, User2 } from "lucide-react";

import { useSession } from "next-auth/react";

export default function UserNav() {
  const session = useSession();
  return (
    <Link href={session.status !== "authenticated" ? "/auth/signin" : "/user/profile"}>
      <Button className="" variant="ghost" size="icon">
        <User2 className=""></User2>
      </Button>
    </Link>
  );
}
