import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";

export default function ErrorTemplate({ children, buttonLabel }: { children: React.ReactNode, buttonLabel: string }) {
  return (
    <div className=" flex flex-col justify-center items-center h-screen text-3xl font-semibold text-center">
      {children}
      <Button className="sm:px-12 py-8 mt-6 flex items-center" variant="ghost">{buttonLabel} <ArrowUpRight className="ml-3" /></Button>
    </div>
  )
}