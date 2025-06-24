"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<number>(0);
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: formData,
    });

    // Handle response if necessary
    setIsLoading(false);
    setStatus(response.status);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit} action="POST">
        <div className="grid gap-2 grid-cols-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              İsim
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="İsim"
              type="text"
              autoCapitalize="none"
              autoComplete=""
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="surname">
              Soyad
            </Label>
            <Input
              id="surname"
              placeholder="Soyad"
              type="text"
              name="surname"
              autoCapitalize="none"
              autoComplete=""
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1 col-span-2">
            <Label className="sr-only" htmlFor="phone">
              Telefon
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Telefon"
              type="tel"
              autoCapitalize="none"
              autoComplete="tel"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1 col-span-2">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1 col-span-2">
            <Label className="sr-only" htmlFor="password">
              Şifre
            </Label>
            <Input
              name="password"
              id="password"
              placeholder="Şifre"
              type="password"
              autoCapitalize="none"
              autoComplete=""
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button
            disabled={isLoading}
            className={
              "col-span-2 " +
              (status == 0
                ? " "
                : status == 200
                  ? " bg-green-400"
                  : "bg-red-600")
            }
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Üye ol
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
    </div>
  );
}
