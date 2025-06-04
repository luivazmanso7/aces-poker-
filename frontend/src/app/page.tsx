import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect para login por padrão
  redirect('/login')
}