"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  telephone: z.string({ required_error: "* Telefon numarası boş bırakılamaz" }),
});

export default function TelephoneForm({phoneNumber}:{phoneNumber:string}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      telephone: phoneNumber
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Telefon Numarası</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input placeholder="+90 555 555 55 55" {...field} />
                  <Button type="submit" className="p-6 ml-2 ">kaydet</Button>
                </div>
              </FormControl>
              <FormDescription>Telefon numarası ekleyeniniz</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
