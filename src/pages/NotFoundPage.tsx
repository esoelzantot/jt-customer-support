import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Mascot } from '@/components/brand/Mascot'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <Mascot interactive={false} className="w-40 opacity-90" />
      <p className="text-display mt-6 text-6xl text-brand-600" dir="ltr">404</p>
      <h1 className="mt-2 text-2xl font-extrabold">{t('notFound.title')}</h1>
      <Link to="/" className="mt-6 rounded-full bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">
        {t('notFound.back')}
      </Link>
    </section>
  )
}
