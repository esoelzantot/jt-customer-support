import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { GuideInput } from '@/features/guides/guideApi'
import type { FinancialInquiry, NewOrderProcedure, TicketCategory, TicketSubtype } from '@/features/guides/types'
import { useLocalized } from '@/features/guides/useLocalized'
import { IconButton, IconInput, LocalizedInput, LocalizedList } from './fields'
import { emptyText } from './formModel'

type EditorProps<T> = { value: T; onChange: (value: T) => void }

function TitleRow<T extends { title: GuideInput['title']; icon?: string }>({ value, onChange }: EditorProps<T>) {
  const { t } = useTranslation()
  return (
    <div className="flex items-start gap-4">
      <IconInput value={value.icon} onChange={(icon) => onChange({ ...value, icon })} />
      <LocalizedInput className="min-w-0 flex-1" label={t('admin.fields.title')} required value={value.title} onChange={(title) => onChange({ ...value, title })} />
    </div>
  )
}

/* ---------- Tickets ---------- */

const emptySubtype =(): TicketSubtype => ({ id: crypto.randomUUID(), title: emptyText(), whenToUse: emptyText() })

export function TicketEditor({ value, onChange }: EditorProps<GuideInput<TicketCategory>>) {
  const { t } = useTranslation()
  const l = useLocalized()
  const setSubtype = (i: number, s: TicketSubtype) => onChange({ ...value, subtypes: value.subtypes.map((x, j) => (j === i ? s : x)) })
  const removeSubtype = (i: number) => onChange({ ...value, subtypes: value.subtypes.filter((_, j) => j !== i) })
  const moveSubtype = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= value.subtypes.length) return
    const next = [...value.subtypes]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange({ ...value, subtypes: next })
  }

  return (
    <div className="space-y-6">
      <TitleRow value={value} onChange={onChange} />
      <LocalizedInput label={t('admin.fields.description')} hint={t('admin.fields.descriptionHint')} multiline rows={4} value={value.description} onChange={(description) => onChange({ ...value, description })} />

      <fieldset>
        <legend className="text-sm font-extrabold">{t('admin.fields.subtypes')}</legend>
        <ol className="mt-3 space-y-4">
          <AnimatePresence initial={false}>
            {value.subtypes.map((s, i) => (
              <motion.li
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl border border-brand-600/15 bg-brand-50/40 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-extrabold text-brand-700">
                    {i + 1}. {l(s.title) || t('admin.fields.newSubtype')}
                  </p>
                  <div className="flex shrink-0 gap-0.5">
                    <IconButton label={t('admin.fields.moveUp')} onClick={() => moveSubtype(i, -1)} disabled={i === 0}>↑</IconButton>
                    <IconButton label={t('admin.fields.moveDown')} onClick={() => moveSubtype(i, 1)} disabled={i === value.subtypes.length - 1}>↓</IconButton>
                    <IconButton label={t('admin.delete')} onClick={() => removeSubtype(i)}>×</IconButton>
                  </div>
                </div>
                <div className="space-y-4">
                  <LocalizedInput label={t('admin.fields.subtypeTitle')} required value={s.title} onChange={(title) => setSubtype(i, { ...s, title })} />
                  <LocalizedInput label={t('admin.fields.whenToUse')} multiline value={s.whenToUse} onChange={(whenToUse) => setSubtype(i, { ...s, whenToUse })} />
                  <LocalizedInput label={t('admin.fields.note')} multiline rows={2} value={s.note} onChange={(note) => setSubtype(i, { ...s, note })} />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
        <button
          type="button"
          onClick={() => onChange({ ...value, subtypes: [...value.subtypes, emptySubtype()] })}
          className="mt-3 rounded-full border-2 border-dashed border-brand-600/30 px-4 py-1.5 text-sm font-bold text-brand-700 hover:border-brand-600 hover:bg-brand-50"
        >
          + {t('admin.fields.addSubtype')}
        </button>
      </fieldset>
    </div>
  )
}

/* ---------- Financial ---------- */

export function FinancialEditor({ value, onChange }: EditorProps<GuideInput<FinancialInquiry>>) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <TitleRow value={value} onChange={onChange} />
      <LocalizedInput label={t('admin.fields.details')} multiline rows={4} value={value.details} onChange={(details) => onChange({ ...value, details })} />
      <LocalizedList
        label={t('admin.fields.employeeActions')}
        addLabel={t('admin.fields.addAction')}
        multiline
        items={value.employeeActions}
        onChange={(employeeActions) => onChange({ ...value, employeeActions })}
      />
      <LocalizedInput label={t('admin.fields.customerReply')} hint={t('admin.fields.customerReplyHint')} multiline rows={5} value={value.customerReply} onChange={(customerReply) => onChange({ ...value, customerReply })} />
      <LocalizedInput label={t('admin.fields.note')} multiline rows={2} value={value.note} onChange={(note) => onChange({ ...value, note })} />
    </div>
  )
}

/* ---------- New order ---------- */

export function NewOrderEditor({ value, onChange }: EditorProps<GuideInput<NewOrderProcedure>>) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <TitleRow value={value} onChange={onChange} />
      <LocalizedInput label={t('admin.fields.summary')} multiline value={value.summary} onChange={(summary) => onChange({ ...value, summary })} />
      <LocalizedList label={t('admin.fields.steps')} addLabel={t('admin.fields.addStep')} multiline items={value.steps} onChange={(steps) => onChange({ ...value, steps })} />
      <LocalizedList
        label={t('admin.fields.requirements')}
        addLabel={t('admin.fields.addRequirement')}
        items={value.requirements}
        onChange={(requirements) => onChange({ ...value, requirements })}
      />
      <LocalizedInput label={t('admin.fields.note')} multiline rows={2} value={value.note} onChange={(note) => onChange({ ...value, note })} />
    </div>
  )
}
