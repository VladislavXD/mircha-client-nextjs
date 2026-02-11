import { redirect } from 'next/navigation'

export default function AdminPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'ru'
  redirect(`/${locale}/admin/dashboard`)
}
