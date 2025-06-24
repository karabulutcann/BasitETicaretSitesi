"use client";
import { Button } from "@/components/ui/button";

export default function ButtonSignOut() {
  return (
    <Button
    className="py-6 px-10"
    onClick={() => {
      fetch("/api/signout", {
        method: "POST",
      }).then((r)=>{
        if(r.ok){
          window.location.href = "/";
        }
      })
    }}
  >
    Çıkış Yap
  </Button>
    )
};