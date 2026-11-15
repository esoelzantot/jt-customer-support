import { Link, Outlet, ScrollRestoration } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/components/brand/Logo'
import { LanguageSwitch } from './LanguageSwitch'
import { SectionNav } from './SectionNav'

const YEAR = new Date().getFullYear()

export function RootLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-brand-600 px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t('nav.skip')}
      </a>

      <header className="sticky top-0 z-40 border-b border-brand-600/10 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label={t('nav.home')} className="text-lg">
            <Logo />
          </Link>
          <SectionNav className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <a
              href="tel:15885"
              className="hidden items-center gap-2 rounded-full border-2 border-brand-600 px-4 py-1 text-sm font-bold text-brand-700 transition hover:bg-brand-600 hover:text-white xl:inline-flex"
            >
              <span>{t('brand.hotline')}</span>
              <span dir="ltr" className="text-display not-italic">15885</span>
            </a>
            <LanguageSwitch />
          </div>
        </div>
        <SectionNav className="-mt-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none] lg:hidden" />
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brand-600 bg-speed-lines text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row sm:px-6">
          <Logo tone="white" />
          <p className="opacity-80">
            © {YEAR} J&amp;T Express · {t('footer.rights')}
          </p>
        </div>
      </footer>

      <ScrollRestoration />
    </div>
  )
}
