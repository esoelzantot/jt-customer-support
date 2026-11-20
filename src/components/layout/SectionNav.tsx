import { motion } from 'motion/react'
import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useNavItems } from './navItems'

export function SectionNav({ className, layoutKey = 'desktop' }: { className?: string; layoutKey?: string }) {
  const { t } = useTranslation()
  const items = useNavItems()

  return (
    <nav aria-label={t('nav.sections')} className={className}>
      <ul className="flex gap-1">
        {items.map(({ to, label, Icon, highlight }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                clsx(
                  'relative flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'text-brand-700' : highlight ? 'text-brand-700 hover:text-brand-800' : 'text-ink-500 hover:text-ink',
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
                  <span className="relative">{label}</span>
                  {highlight && !isActive && <span className="relative rounded-full bg-brand-600 px-1.5 py-px text-[0.6rem] font-bold text-white">{t('rates.newBadge')}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
