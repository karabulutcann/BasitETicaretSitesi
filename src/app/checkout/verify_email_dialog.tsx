import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertDestructive } from "@/components/alert";
import { baseUrl } from "@/local.env";
import { Cart } from "@/types/cart";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import {
  PaymentRequestAuth,
  NotInStockResponseUnAuth,
  PaymentRequestUnAuth,
} from "../api/checkout/payment/route";
import { formSchema } from "./form_un_auth";
import { useRouter } from "next/navigation";
import updateCartUnAuth from "@/lib/update_cart";

const verifyFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Doğrulama kodu 6 karakterden oluşmalıdır.",
  }),
});

export default function VerifyEmailDialog({
  isOpen,
  setIsOpen,
  isLoading,
  setIsLoading,
  formValues,
  dispatch,
  setStockStatus,
  setCheckoutFormContent,
  setIsPaymentOpen,
}: {
  isOpen: boolean;
  setIsOpen: any;
  isLoading: boolean;
  setIsLoading: any;
  formValues: z.infer<typeof formSchema>;
  dispatch: any;
  setStockStatus: any;
  setCheckoutFormContent: any;
  setIsPaymentOpen: any;
}) {
  const [resendStatus, setResendStatus] = useState<number>(0);
  const [verifyEmailStatus, setVerifyEmailStatus] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(30); // Initial countdown time in seconds
  const [isClickable, setIsClickable] = useState(false);

  const verifyForm = useForm<z.infer<typeof verifyFormSchema>>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 1) {
          clearInterval(timer); // Clear the interval when the countdown is done
          setIsClickable(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const verifyOnSubmit = (values: z.infer<typeof verifyFormSchema>) => {
    setIsLoading(true);
    const cartItems: Cart[] = JSON.parse(localStorage.getItem("cart")!);

    fetch(baseUrl + "/api/checkout/payment", {
      method: "POST",
      body: JSON.stringify({
        ...formValues,
        emailVerifyCode: values.pin,
        cartItems: cartItems.map((c) => ({
          productId: c.product.id,
          size: c.size,
          productCount: c.productCount,
        })),
      } as PaymentRequestUnAuth),
    })
      .then((r) => {
        setVerifyEmailStatus(r.status);
        setIsLoading(false);
        if (r.ok) {
          return r.json();
        }
      })
      .then((r) => {
        if(r !== undefined){
          if (r.code === 255) {
            updateCartUnAuth(dispatch, r);
            setIsLoading(false);
            setStockStatus(r.code);
            setIsOpen(false);
          } else if (r.code === 200) {
            setCheckoutFormContent(r.checkoutFormContent);
            setIsPaymentOpen(true);
            setIsOpen(false);
          }
        } 
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogContent
        className="flex justify-center items-center py-12 px-6"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="max-w-lg px-12">
          <div className="text-2xl font-semibold pb-12 text-start">
            Email Doğrulama
          </div>
          {verifyEmailStatus === 400 && (
            <AlertDestructive
              errHeader="Hata"
              errDescription="Geçersiz doğrulama isteği"
            ></AlertDestructive>
          )}
          {verifyEmailStatus === 401 && (
            <AlertDestructive
              errHeader="Hata"
              errDescription="Email doğrulama kodu hatalı"
            ></AlertDestructive>
          )}
          {verifyEmailStatus === 403 && (
            <AlertDestructive
              errHeader="Hata"
              errDescription="Doğrulama süresi doldu"
            ></AlertDestructive>
          )}
          {verifyEmailStatus === 500 && (
            <AlertDestructive
              errHeader="Hata"
              errDescription="Sunucuda bir hata oluştu"
            ></AlertDestructive>
          )}
          {resendStatus === 500 && (
            <AlertDestructive
              errHeader="Hata"
              errDescription="Kod tekrar gönderilirken sunucuda bir hata oluştu"
            ></AlertDestructive>
          )}
          {resendStatus === 400 && (
            <AlertDestructive
              errHeader="Hata"
              errDescription="Kod tekrar gönderilemedi geçersiz token"
            ></AlertDestructive>
          )}
          {verifyEmailStatus === 200 ? (
            <div>
              <div className="text-lg font-medium py-12">
                Email başarıyla doğrulandı. Ödeme Sayfasına
                yönlendiriliyorsunuz...
              </div>
            </div>
          ) : (
            <div>
              <Form {...verifyForm}>
                <form
                  onSubmit={verifyForm.handleSubmit(verifyOnSubmit)}
                  className=" space-y-12"
                >
                  <FormField
                    control={verifyForm.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email doğrulama kodu</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription className="pt-6">
                          Emailinize gönderdiğimiz 6 haneli doğrulama kodunu
                          giriniz. Eğer kod gelmediyse kodu tekrar gönder
                          butonuna tıklayınız.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant={"secondary"}
                    disabled={isLoading}
                    className={"w-full py-6 "}
                  >
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Doğrula
                  </Button>
                </form>
              </Form>
              <Button
                disabled={isLoading || !isClickable}
                variant="outline"
                className={"w-full py-6 mt-6"}
                onClick={() => {
                  fetch(baseUrl + "/api/checkout/send_verify_email", {
                    method: "POST",
                    body: JSON.stringify({
                      email: formValues.email,
                      name: formValues.name,
                      surname: formValues.surname,
                    }),
                  });
                }}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isClickable
                  ? "Kodu tekrar gönder"
                  : "kodu tekrar göndermek için " +
                    timeRemaining +
                    " saniye bekleyiniz"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
