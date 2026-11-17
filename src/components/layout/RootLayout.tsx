import { useEffect, useState } from 'react'
import { Link, Outlet, ScrollRestoration } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Logo } from '@/components/brand/Logo'
import { SearchLauncher } from '@/features/search/SearchLauncher'
import { GUIDE_SECTIONS } from '@/features/guides/sections'
import { SearchButton } from './SearchButton'
import { SectionNav } from './SectionNav'

const YEAR = new Date().getFullYear()

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

export function RootLayout() {
  const { t } = useTranslation()
  const scrolled = useScrolled()

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-brand-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t('nav.skip')}
      </a>

      <header
        className={clsx(
          'sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300',
          scrolled ? 'border-b border-line bg-cream/80 shadow-[0_8px_24px_-18px_rgb(23_18_15/0.35)] backdrop-blur-xl' : 'border-b border-transparent bg-cream',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" aria-label={t('nav.home')} className="shrink-0">
            <Logo className="h-6 sm:h-7" />
          </Link>
          <SectionNav className="ms-4 hidden lg:block" />
          <div className="ms-auto flex min-w-0 flex-1 justify-end lg:ms-6">
            <SearchButton className="w-full max-w-sm lg:max-w-md" />
          </div>
        </div>
        <SectionNav layoutKey="mobile" className="overflow-x-auto px-3 pb-2 [scrollbar-width:none] lg:hidden" />
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="relative overflow-hidden bg-brand-600 text-white">
        <div aria-hidden className="bg-speed-lines absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="white" className="h-9" />
            <p className="text-display mt-5 text-2xl">{t('brand.tagline')}</p>
            <p className="mt-2 max-w-sm text-white/80">{t('footer.about')}</p>
          </div>
          <nav aria-label={t('nav.sections')}>
            <p className="text-sm font-semibold text-white/70">{t('nav.sections')}</p>
            <ul className="mt-4 space-y-2.5">
              {GUIDE_SECTIONS.map((s) => (
                <li key={s.slug}>
                  <Link to={`/guides/${s.slug}`} className="inline-flex items-center gap-2 font-semibold hover:underline">
                    <s.Icon className="size-4" />
                    {t(`sections.${s.key}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-sm font-semibold text-white/70">{t('brand.hotline')}</p>
            <a href="tel:15885" className="text-display mt-3 block text-5xl tracking-tight hover:opacity-90 rtl:text-right" dir="ltr" lang="en">
              15885
            </a>
          </div>
        </div>
        <div className="relative bg-brand-50">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-ink-500 sm:flex-row sm:px-6">
            <p>
              © <span dir="ltr">{YEAR}</span> J&amp;T Express. {t('footer.rights')}.
            </p>
            <p>
              {t('footer.credit')}{' '}
              <span dir="ltr" lang="en" className="font-bold text-brand-700">
                Eng. Eslam Shaker
              </span>
            </p>
          </div>
        </div>
      </footer>

      <SearchLauncher />
      <ScrollRestoration />
    </div>
  )
}
