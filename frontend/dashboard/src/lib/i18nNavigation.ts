import { localePrefix, localesConfig } from '@/utils/localesConfig';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';


export const { usePathname, useRouter } = createSharedPathnamesNavigation({
  locales: localesConfig,
  localePrefix: localePrefix,
});