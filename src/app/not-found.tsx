import ErrorTemplate from '@/components/error_template'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>

      <ErrorTemplate buttonLabel="Ana sayfaya git">Aradığınız sayfa bulunamadı</ErrorTemplate>
    </div>
  )
}