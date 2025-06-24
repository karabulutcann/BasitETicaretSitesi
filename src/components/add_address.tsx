"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { Building2, Check, House, MapPin, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CaretDownIcon, CaretSortIcon } from "@radix-ui/react-icons";
import React from "react";
import { CommandList } from "cmdk";
import { baseUrl } from "@/local.env";
import { useRouter} from "next/navigation";
import {  addressSchema } from "@/db/schema";
import { Locations } from "@/types";


const formSchema = z.object({
  addressName: z
    .string()
    .min(1, {
      message: "Adres adı bos olamaz.",
    })
    .max(32, {
      message: "Adres adı 64 karakterden uzun olamaz.",
    }),
  addressType: z.string().min(1, {
    message: "Adres tipi bos olamaz.",
  }),
  city: z.string().min(1, {
    message: "Şehir bos olamaz.",
  }),
  district: z.string().min(1, {
    message: "İlçe bos olamaz.",
  }),

  address: z.string().min(1, {
    message: "Açık adres bos olamaz.",
  }),
});

export default function AddAddress({
  buttonClassName,
  isClient = false,
  cities,
  callbackFn,
}: {
  buttonClassName: string | undefined;
  isClient: boolean;
  cities: Locations[];
  callbackFn: undefined | ((address: (typeof addressSchema.$inferSelect)) => void) ;
}) {
  const [city, setCity] = React.useState<string>("");
  const [status, setStatus] = React.useState<number>(0);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressName: "",
      addressType: "home",
      city: "",
      district: "",
      address: "",
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={buttonClassName}>
          adres ekle <Plus className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-[300px]:h-screen">
        <DialogHeader>
          <DialogTitle>Adres ekle</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              fetch(baseUrl + "/api/address/add_address", {
                method: "POST",
                body: JSON.stringify(data),
              })
                .then((r) => {
                  if (r.ok) {
                    if (isClient) {
                      return r.json();
                    } else {
                      router.refresh();
                     
                    }
                    setIsOpen(false);
                  }
                  setStatus(r.status);
                })
                .then((r) => {
                  if (isClient) {
                    callbackFn!(r);
                  }
                });
            })}
            className=" gap-8 grid grid-cols-2 py-8"
          >
            <FormField
              control={form.control}
              name="addressName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Ev" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres Türü</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="h-12 text-white/75">
                        <SelectValue placeholder="Adres Türü" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">
                          <div className="flex">
                            <House className="mr-1 h-4" />
                            Ev
                          </div>
                        </SelectItem>
                        <SelectItem value="work" className="flex">
                          <div className="flex">
                            <Building2 className="mr-1 h-4" />
                            İş yeri
                          </div>
                        </SelectItem>
                        <SelectItem value="other" className="flex">
                          <div className="flex">
                            <MapPin className="mr-1 h-4" />
                            Diğer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şehir</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "h-12 mt-6 flex w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? cities.find((c) => c.city === field.value)?.city
                              : "İl seçin"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[223px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search framework..."
                            className="h-9"
                          />

                          <CommandList>
                            <CommandEmpty>İl bulunamadı.</CommandEmpty>
                            <CommandGroup>
                              {cities.map((c) => (
                                <CommandItem
                                  value={c.city}
                                  key={c.city}
                                  onSelect={() => {
                                    form.setValue("city", c.city);
                                    setCity(c.city);
                                  }}
                                >
                                  {c.city}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      c.city === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İlçe</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "h-12 mt-6 flex w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? cities
                                  .find((c) => c.city === city)
                                  ?.districts.find((d) => d.district === field.value)?.district
                              : "İlçe seçin"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[223px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search framework..."
                            className="h-9"
                          />

                          <CommandList>
                            <CommandEmpty>Lütfen il seçin</CommandEmpty>
                            <CommandGroup>
                              {cities
                                .find((c) => c.city === city)
                                ?.districts.map((d) => (
                                  <CommandItem
                                    value={d.district}
                                    key={d.district}
                                    onSelect={() => {
                                      form.setValue("district", d.district!);
                                    }}
                                  >
                                    {d.district}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        d.district === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Açık Adres</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 flex flex-col">
              {status === 500 && (
                <div className="text-destructive col-span-2">
                  * Sunucuda bir hata oluştu
                </div>
              )}
              {status === 400 && (
                <div className="text-destructive col-span-2">
                  * Girdiğiniz Bilgileri Kontrol edin
                </div>
              )}
              <Button type="submit" className=" mx-4 py-6 my-4">
                Kaydet
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
