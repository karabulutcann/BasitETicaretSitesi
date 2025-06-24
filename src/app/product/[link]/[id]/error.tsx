"use client"; // Error components must be Client Components

import ErrorTemplate from "@/components/error_template";
import { useEffect } from "react";



export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
  
  }, [error]);

  switch (error.message) {
    case "1":
      return <ErrorTemplate buttonLabel="Anasayfaya git">Ürün bulunamadı</ErrorTemplate>;

    default:
      return <ErrorTemplate buttonLabel="Anasayfaya git">Beklenmedik bir hata oluştu</ErrorTemplate>;
  }

}
