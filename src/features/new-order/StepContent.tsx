import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { RichText } from '@/features/guides/RichText'
import type { NewOrderProcedure } from '@/features/guides/types'
import { useLocalized } from '@/features/guides/useLocalized'
import { CompensationCalculator } from './widgets/CompensationCalculator'
import { OrderChannels } from './widgets/OrderChannels'
import { ProhibitedChecker } from './widgets/ProhibitedChecker'
import { TermsSummary } from './widgets/TermsSummary'
import { WeightCalculator } from './widgets/WeightCalculator'

type Props = { step: NewOrderProcedure; index: number; total: number; onGoTo: (id: string) => void }

export function StepContent({ step, index, total, onGoTo }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()
  const [params] = useSearchParams()

  const widget = (() => {
    switch (step.widget) {
      case 'prohibited-items':
        // Re-mount when global search sends a new ?check= value.
        return <ProhibitedChecker key={params.get('check') ?? ''} />
      case 'weight-calculator':
        return <WeightCalculator />
      case 'compensation':
        return <CompensationCalculator />
      case 'order-channels':
        return <OrderChannels onContinue={() => onGoTo('order-data')} />
      case 'terms':
        return <TermsSummary />
      default:
        return null
    }
  })()

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand-600 text-3xl shadow-brand">
          <span aria-hidden>{step.icon ?? '📦'}</span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-brand-700">{t('newOrder.stepOf', { n: index + 1, total })}</p>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{l(step.title)}</h2>
          {step.summary && <p className="mt-2 text-[1.0625rem] leading-8 text-ink-500">{l(step.summary)}</p>}
        </div>
      </header>

      {step.requirements.length > 0 && (
        <section className="rounded-[1.5rem] bg-white p-5 shadow-card ring-1 ring-line">
          <p className="flex items-center gap-2 font-bold">
            <span aria-hidden className="grid size-7 place-items-center rounded-full bg-ink text-sm text-white">؟</span>
            {t('newOrder.ask')}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {step.requirements.map((r, i) => (
              <li key={i} className="rounded-2xl rounded-ss-md bg-cream px-4 py-2.5 text-[1.0625rem] font-semibold text-ink-700">
                💬 {l(r)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {step.steps.length > 0 && (
        <section className="rounded-[1.5rem] bg-white p-5 shadow-card ring-1 ring-line">
          <p className="font-bold">{t('newOrder.do')}</p>
          <ol className="mt-4 space-y-4">
            {step.steps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="text-display grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-sm text-brand-700" dir="ltr" lang="en">
                  {i + 1}
                </span>
                <RichText text={l(s)} className="min-w-0 flex-1 pt-0.5 text-[1.0625rem] leading-8 text-ink-700 sm:text-lg sm:leading-9" />
              </li>
            ))}
          </ol>
        </section>
      )}

      {widget}

      {step.note && (
        <aside className="rounded-2xl bg-cream p-4 ring-1 ring-line">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[0.7rem] font-bold text-white">!</span>
            {t('tickets.note')}
          </p>
          <RichText text={l(step.note)} className="mt-2 text-base leading-8 text-ink-700" />
        </aside>
      )}
    </div>
  )
}
