import { useTranslation } from 'react-i18next'
import { CalculatorIcon, type IconComponent } from '@/components/icons/GuideIcons'
import { GUIDE_SECTIONS } from '@/features/guides/sections'

export type NavItem = { to: string; label: string; Icon: IconComponent; highlight?: boolean }

/** Header/footer navigation: the three guide sections + the rates calculator. */
export function useNavItems(): NavItem[] {
  const { t } = useTranslation()
  return [
    ...GUIDE_SECTIONS.map(({ slug, key, Icon }) => ({ to: `/guides/${slug}`, label: t(`sections.${key}.title`), Icon })),
    { to: '/rates', label: t('rates.navTitle'), Icon: CalculatorIcon, highlight: true },
  ]
}
