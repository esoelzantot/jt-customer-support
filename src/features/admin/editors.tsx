import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { GuideInput } from '@/features/guides/guideApi'
import type { CustomerReply, FinancialInquiry, NewOrderProcedure, TicketCategory, TicketSubtype } from '@/features/guides/types'
import { useGuideCollection } from '@/features/guides/useGuideCollection'
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
      <LocalizedList
        label={t('admin.fields.rules')}
        hint={t('admin.fields.rulesHint')}
        addLabel={t('admin.fields.addRule')}
        items={value.rules ?? []}
        onChange={(rules) => onChange({ ...value, rules })}
      />
      <p className="rounded-2xl bg-white p-3 text-xs leading-6 text-ink/60 ring-1 ring-brand-600/10">{t('admin.fields.formattingHint')}</p>

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
      <LocalizedInput label={t('admin.fields.group')} hint={t('admin.fields.groupHint')} value={value.group} onChange={(group) => onChange({ ...value, group })} />
      <LocalizedInput label={t('admin.fields.details')} multiline rows={3} value={value.details} onChange={(details) => onChange({ ...value, details })} />
      <LocalizedList
        label={t('admin.fields.employeeActions')}
        addLabel={t('admin.fields.addAction')}
        multiline
        items={value.employeeActions}
        onChange={(employeeActions) => onChange({ ...value, employeeActions })}
      />
      <RepliesField replies={value.replies ?? []} onChange={(replies) => onChange({ ...value, replies })} />
      <RelatedTicketsField selected={value.relatedTickets ?? []} onChange={(relatedTickets) => onChange({ ...value, relatedTickets })} />
      <LocalizedInput label={t('admin.fields.note')} multiline rows={2} value={value.note} onChange={(note) => onChange({ ...value, note })} />
    </div>
  )
}

function RepliesField({ replies, onChange }: { replies: CustomerReply[]; onChange: (r: CustomerReply[]) => void }) {
  const { t } = useTranslation()
  const update = (i: number, r: CustomerReply) => onChange(replies.map((x, j) => (j === i ? r : x)))
  return (
    <fieldset>
      <legend className="text-sm font-extrabold">{t('admin.fields.customerReply')}</legend>
      <p className="mt-0.5 text-xs text-ink-500">{t('admin.fields.repliesHint')}</p>
      <div className="mt-3 space-y-4">
        {replies.map((r, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 ring-1 ring-line">
            <div className="mb-3 flex items-center gap-2">
              <input
                value={r.label ?? ''}
                onChange={(e) => update(i, { ...r, label: e.target.value || undefined })}
                placeholder={t('admin.fields.replyLabel')}
                aria-label={t('admin.fields.replyLabel')}
                dir="ltr"
                className="field w-40 py-1.5 text-sm"
              />
              <span className="flex-1" />
              {replies.length > 1 && (
                <IconButton label={t('admin.delete')} onClick={() => onChange(replies.filter((_, j) => j !== i))}>×</IconButton>
              )}
            </div>
            <LocalizedInput label={`${t('admin.fields.customerReply')} ${i + 1}`} multiline rows={3} value={r.text} onChange={(text) => update(i, { ...r, text })} className="[&>label]:sr-only" />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...replies, { text: emptyText() }])}
        className="mt-3 rounded-full border-2 border-dashed border-brand-600/30 px-4 py-1.5 text-sm font-bold text-brand-700 hover:border-brand-600 hover:bg-brand-50"
      >
        + {t('admin.fields.addReplyVariant')}
      </button>
    </fieldset>
  )
}

function RelatedTicketsField({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const { data } = useGuideCollection('ticketCategories')
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  return (
    <fieldset>
      <legend className="text-sm font-extrabold">{t('admin.fields.relatedTickets')}</legend>
      <p className="mt-0.5 text-xs text-ink-500">{t('admin.fields.relatedTicketsHint')}</p>
      <div className="mt-3 max-h-56 space-y-3 overflow-y-auto rounded-2xl bg-white p-3 ring-1 ring-line">
        {data.map((c) => (
          <div key={c.id}>
            <p className="text-xs font-semibold text-ink-500" dir="auto">{c.icon} {l(c.title)}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {c.subtypes.map((s) => {
                const on = selected.includes(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(s.id)}
                    dir="ltr"
                    className={on ? 'rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white' : 'rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink-700 hover:text-brand-700'}
                  >
                    {l(s.title)}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
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
