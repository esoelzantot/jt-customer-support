import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import type { LocalizedText } from '@/features/guides/types'
import { emptyText } from './formModel'

type FieldProps = { label: string; hint?: string; required?: boolean; children: (id: string) => ReactNode; className?: string }

export function Field({ label, hint, required, children, className }: FieldProps) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-extrabold text-ink">
        {label}
        {required && <span className="ms-1 text-brand-600">*</span>}
      </label>
      {hint && <p className="mt-0.5 text-xs text-ink/50">{hint}</p>}
      <div className="mt-1.5">{children(id)}</div>
    </div>
  )
}

type LocalizedInputProps = {
  label: string
  hint?: string
  value?: LocalizedText
  onChange: (value: LocalizedText) => void
  multiline?: boolean
  rows?: number
  required?: boolean
  className?: string
}

/** Arabic is the source of truth; English is an optional, collapsible translation. */
export function LocalizedInput({ label, hint, value, onChange, multiline, rows = 3, required, className }: LocalizedInputProps) {
  const { t } = useTranslation()
  const v = value ?? emptyText()
  const [showEn, setShowEn] = useState(Boolean(v.en))
  const Tag = multiline ? 'textarea' : 'input'

  return (
    <Field label={label} hint={hint} required={required} className={className}>
      {(id) => (
        <div className="space-y-2">
          <Tag
            id={id}
            lang="ar"
            dir="rtl"
            rows={multiline ? rows : undefined}
            required={required}
            value={v.ar}
            onChange={(e) => onChange({ ...v, ar: e.target.value })}
            placeholder={t('admin.fields.arabic')}
            className="field"
          />
          <AnimatePresence initial={false}>
            {showEn && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <Tag
                  lang="en"
                  dir="ltr"
                  aria-label={`${label} (English)`}
                  rows={multiline ? rows : undefined}
                  value={v.en ?? ''}
                  onChange={(e) => onChange({ ...v, en: e.target.value || undefined })}
                  placeholder="English (optional)"
                  className="field"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => {
              if (showEn) onChange({ ar: v.ar })
              setShowEn(!showEn)
            }}
            className="text-xs font-bold text-brand-700 hover:underline"
          >
            {showEn ? t('admin.fields.removeEn') : t('admin.fields.addEn')}
          </button>
        </div>
      )}
    </Field>
  )
}

type LocalizedListProps = {
  label: string
  hint?: string
  items: LocalizedText[]
  onChange: (items: LocalizedText[]) => void
  addLabel: string
  multiline?: boolean
}

/** Ordered list of localized entries (steps, actions, requirements). */
export function LocalizedList({ label, hint, items, onChange, addLabel, multiline }: LocalizedListProps) {
  const { t } = useTranslation()
  // Stable keys so per-row UI state (e.g. the English toggle) follows its row on move/remove.
  const [keys, setKeys] = useState(() => items.map(() => crypto.randomUUID()))
  const update = (i: number, value: LocalizedText) => onChange(items.map((it, j) => (j === i ? value : it)))
  const add = () => {
    setKeys([...keys, crypto.randomUUID()])
    onChange([...items, emptyText()])
  }
  const remove = (i: number) => {
    setKeys(keys.filter((_, j) => j !== i))
    onChange(items.filter((_, j) => j !== i))
  }
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const swap = <T,>(arr: T[]) => {
      const next = [...arr]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    }
    setKeys(swap(keys))
    onChange(swap(items))
  }

  return (
    <fieldset>
      <legend className="text-sm font-extrabold">{label}</legend>
      {hint && <p className="mt-0.5 text-xs text-ink/50">{hint}</p>}
      <ol className="mt-2 space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <motion.li
              key={keys[i] ?? i}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2"
            >
              <span className="text-display mt-2 grid size-7 shrink-0 place-items-center rounded-full bg-brand-600 text-xs text-white" dir="ltr">
                {i + 1}
              </span>
              <LocalizedInput label={`${label} ${i + 1}`} value={item} onChange={(v) => update(i, v)} multiline={multiline} rows={2} className="min-w-0 flex-1 [&>label]:sr-only" />
              <div className="mt-1 flex shrink-0 flex-col gap-0.5">
                <IconButton label={t('admin.fields.moveUp')} onClick={() => move(i, -1)} disabled={i === 0}>↑</IconButton>
                <IconButton label={t('admin.fields.moveDown')} onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</IconButton>
                <IconButton label={t('admin.delete')} onClick={() => remove(i)}>×</IconButton>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <button
        type="button"
        onClick={add}
        className="mt-3 rounded-full border-2 border-dashed border-brand-600/30 px-4 py-1.5 text-sm font-bold text-brand-700 hover:border-brand-600 hover:bg-brand-50"
      >
        + {addLabel}
      </button>
    </fieldset>
  )
}

export function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={clsx('grid size-7 place-items-center rounded-lg text-sm font-bold text-ink/50 transition hover:bg-brand-50 hover:text-brand-700 disabled:opacity-25')}
    >
      {children}
    </button>
  )
}

export function IconInput({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  const { t } = useTranslation()
  return (
    <Field label={t('admin.fields.icon')} hint={t('admin.fields.iconHint')}>
      {(id) => (
        <input
          id={id}
          value={value ?? ''}
          maxLength={4}
          onChange={(e) => onChange(e.target.value || undefined)}
          className="field w-20 text-center text-xl"
          placeholder="📦"
        />
      )}
    </Field>
  )
}
