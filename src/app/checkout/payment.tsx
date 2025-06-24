"use client";
import { baseUrl } from "@/local.env";
import { useEffect } from "react";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function Payment({
    isOpen,
    setIsOpen,
  checkoutFormContent,
}: {
  isOpen: boolean;
  setIsOpen: any;
  checkoutFormContent: string | undefined;
}) {
  useEffect(() => {
    // Create a temporary container div
    if(checkoutFormContent){
      const tempDiv = document.createElement("div");
    tempDiv.innerHTML = checkoutFormContent;

    // Extract the script tag from the temp div
    const scriptTag = tempDiv.querySelector("script");

    if (scriptTag) {
      // Create a new script element
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.text = scriptTag.innerHTML;

      // Append the script to the document head or body
      document.body.appendChild(script);
    }
    }
  }, [checkoutFormContent]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogContent className="h-[85vh]  py-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Ödeme</DialogTitle>
        </DialogHeader>
        <div className="h-full overflow-scroll overflow-x-hidden scroll2">
        <div id="iyzipay-checkout-form" className="responsive"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
