import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { saveGuide, type GuideDoc, type GuideInput } from '@/features/guides/guideApi'
import type { GuideSection } from '@/features/guides/sections'
import type { FinancialInquiry, NewOrderProcedure, TicketCategory } from '@/features/guides/types'
import { FinancialEditor, NewOrderEditor, TicketEditor } from './editors'
import { emptyInput, ensureRequired, normalize, toInput } from './formModel'

type Props = {
  section: GuideSection
  /** `null` = create a new document. */
  doc: GuideDoc | null
  open: boolean
  nextOrder: number
  onClose: () => void
}

export function EditorDrawer(props: Props) {
  return (
    <AnimatePresence>
      {props.open && <DrawerPanel key={props.doc?.id ?? 'new'} {...props} />}
    </AnimatePresence>
  )
}

function DrawerPanel({ section, doc, nextOrder, onClose }: Props) {
  const { t, i18n } = useTranslation()
  const [initial] = useState<GuideInput>(() => (doc ? toInput(doc) : emptyInput(section.collection, nextOrder)))
  const [value, setValue] = useState<GuideInput>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dirty = JSON.stringify(value) !== JSON.stringify(initial)
  const fromX = i18n.dir() === 'rtl' ? '-100%' : '100%'

  const requestClose = () => {
    if (dirty && !window.confirm(t('admin.editor.discard'))) return
    onClose()
  }

  // Esc closes; lock page scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && requestClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!value.title.ar.trim()) {
      setError(t('admin.editor.titleRequired'))
      return
    }
    setSaving(true)
    setError(null)
    try {
      await saveGuide(section.collection, ensureRequired(section.collection, normalize(value)), doc?.id)
      onClose()
    } catch {
      setError(t('admin.errors.save'))
      setSaving(false)
    }
  }

  const editor = (() => {
    switch (section.collection) {
      case 'ticketCategories':
        return <TicketEditor value={value as GuideInput<TicketCategory>} onChange={setValue} />
      case 'financialInquiries':
        return <FinancialEditor value={value as GuideInput<FinancialInquiry>} onChange={setValue} />
      case 'newOrderProcedures':
        return <NewOrderEditor value={value as GuideInput<NewOrderProcedure>} onChange={setValue} />
    }
  })()

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={requestClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <motion.form
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
        onSubmit={onSubmit}
        initial={{ x: fromX }}
        animate={{ x: 0 }}
        exit={{ x: fromX }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="absolute inset-y-0 end-0 flex w-full max-w-2xl flex-col bg-cream shadow-2xl"
        noValidate
      >
        <header className="flex items-center gap-3 bg-gradient-to-br from-brand-600 to-brand-800 px-5 py-4 text-white">
          <section.Icon className="size-7 shrink-0" />
          <h2 id="editor-title" className="min-w-0 flex-1 truncate text-lg font-extrabold">
            {doc ? t('admin.editor.editTitle') : t('admin.editor.newTitle')} · {t(`sections.${section.key}.title`)}
          </h2>
          <button type="button" onClick={requestClose} aria-label={t('admin.cancel')} className="grid size-9 place-items-center rounded-full text-xl hover:bg-white/15">
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6">{editor}</div>

        <footer className="flex items-center gap-3 border-t border-brand-600/10 bg-white px-5 py-4">
          {error && (
            <p role="alert" className="min-w-0 flex-1 text-sm font-semibold text-brand-700">
              {error}
            </p>
          )}
          <div className="ms-auto flex gap-2">
            <button type="button" onClick={requestClose} className="rounded-full px-5 py-2.5 font-bold text-ink/70 hover:bg-ink/5">
              {t('admin.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving || !dirty}
              className="rounded-full bg-brand-600 px-6 py-2.5 font-extrabold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? t('admin.editor.saving') : t('admin.editor.save')}
            </button>
          </div>
        </footer>
      </motion.form>
    </div>
  )
}
