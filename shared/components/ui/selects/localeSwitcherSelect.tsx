
import { Locale, routing } from '@/src/i18n/routing'
import { Select, SelectItem } from '@heroui/react'
import { useLocale } from 'next-intl'
import React from 'react'
import { useRouter } from '@/src/i18n/navigation'
import { usePathname } from '@/src/i18n/navigation'
import { useParams } from 'next/navigation'

export const LocaleSwitcherSelect = () => {
  const locale : string = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()


  function handleSelect(keys: any) {
    const nextLocale = Array.from(keys)[0] as Locale
    if (nextLocale && nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale })
    }
  }

	return (
		<div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select
        isVirtualized
        className="max-w-xs"
        maxListboxHeight={90}
        label="Language"
        selectedKeys={[locale]}
        size='sm'
        variant='bordered'
        onSelectionChange={handleSelect}
      >
        {routing.locales.map((loc) => (
          <SelectItem key={loc}>{loc === 'en' ? 'English' : loc === 'ru' ? 'Русский' : loc}</SelectItem>
        ))}
      </Select>
    </div>
	)
}

