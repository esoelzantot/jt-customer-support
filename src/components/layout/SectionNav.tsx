import { motion } from 'motion/react'
import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { GUIDE_SECTIONS } from '@/features/guides/sections'

export function SectionNav({ className, layoutKey = 'desktop' }: { className?: string; layoutKey?: string }) {
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
                  'relative flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'text-brand-700' : 'text-ink-500 hover:text-ink',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId={`nav-pill-${layoutKey}`}
                      className="absolute inset-0 rounded-full bg-brand-50 ring-1 ring-brand-100"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon className="relative size-4" />
                  <span className="relative">{t(`sections.${key}.title`)}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
