'use client'

import ErrorTemplate from "@/components/error_template"
import { Button } from "@/components/ui/button"
import Link from "next/link"

 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorTemplate buttonLabel="Anasayfaya git">Beklenmedik bir hata oluştu</ErrorTemplate>
  )
}