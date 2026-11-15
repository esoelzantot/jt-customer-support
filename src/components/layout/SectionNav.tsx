import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { GUIDE_SECTIONS } from '@/features/guides/sections'

export function SectionNav({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('nav.sections')} className={className}>
      <ul className="flex gap-1">
        {GUIDE_SECTIONS.map(({ slug, key, Icon }) => (
          <li key={slug}>
            <NavLink
              to={`/guides/${slug}`}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-bold transition',
                  isActive ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25' : 'text-ink/70 hover:bg-brand-600/10 hover:text-brand-700',
                )
              }
            >
              <Icon className="size-4" />
              {t(`sections.${key}.title`)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
