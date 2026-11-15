import { useRef, useState } from 'react'
import { AnimatePresence, Reorder, motion, useDragControls } from 'motion/react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@/components/ui/Spinner'
import { EditorDrawer } from '@/features/admin/EditorDrawer'
import { ConfirmDialog } from '@/features/admin/ConfirmDialog'
import { deleteGuide, reorderGuides, type GuideDoc } from '@/features/guides/guideApi'
import { findSection, type GuideSection } from '@/features/guides/sections'
import { useGuideCollection } from '@/features/guides/useGuideCollection'
import { useLocalized } from '@/features/guides/useLocalized'
import { NotFoundPage } from '@/pages/NotFoundPage'

/** Short, section-specific summary under each row's title. */
function useRowMeta() {
  const { t } = useTranslation()
  return (doc: GuideDoc) => {
    if ('subtypes' in doc) return t('admin.meta.subtypes', { count: doc.subtypes.length })
    if ('employeeActions' in doc) return t('admin.meta.actions', { count: doc.employeeActions.length })
    if ('steps' in doc) return t('admin.meta.steps', { count: doc.steps.length, req: doc.requirements.length })
    return ''
  }
}

type RowProps = { doc: GuideDoc; index: number; onEdit: () => void; onDelete: () => void; onDragEnd: () => void }

function Row({ doc, index, onEdit, onDelete, onDragEnd }: RowProps) {
  const { t } = useTranslation()
  const l = useLocalized()
  const meta = useRowMeta()
  const controls = useDragControls()

  return (
    <Reorder.Item
      value={doc}
      dragListener={false}
      dragControls={controls}
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px rgb(129 23 27 / 0.18)' }}
      className="flex items-center gap-3 rounded-2xl border border-brand-600/10 bg-white p-3 sm:gap-4 sm:p-4"
    >
      <button
        type="button"
        onPointerDown={(e) => {
          controls.start(e)
          // Commit when the pointer is released anywhere; more reliable than Reorder.Item's onDragEnd.
          const listeners = new AbortController()
          const end = () => {
            listeners.abort()
            onDragEnd()
          }
          window.addEventListener('pointerup', end, { signal: listeners.signal })
          window.addEventListener('pointercancel', end, { signal: listeners.signal })
        }}
        aria-label={t('admin.list.drag')}
        className="grid size-9 shrink-0 cursor-grab touch-none place-items-center rounded-xl text-ink/40 hover:bg-brand-50 hover:text-brand-600 active:cursor-grabbing"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
          {[6, 12, 18].flatMap((y) => [9, 15].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" />))}
        </svg>
      </button>

      <span className="text-display grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-sm text-brand-700" dir="ltr">
        {doc.icon || index + 1}
      </span>

      <button type="button" onClick={onEdit} className="min-w-0 flex-1 text-start">
        <p className="truncate font-extrabold">{l(doc.title)}</p>
        <p className="truncate text-sm text-ink/55">{meta(doc)}</p>
      </button>

      <div className="flex shrink-0 gap-1">
        <button type="button" onClick={onEdit} className="rounded-full px-3 py-1.5 text-sm font-bold text-brand-700 hover:bg-brand-50">
          {t('admin.edit')}
        </button>
        <button type="button" onClick={onDelete} className="rounded-full px-3 py-1.5 text-sm font-bold text-ink/50 hover:bg-brand-50 hover:text-brand-700">
          {t('admin.delete')}
        </button>
      </div>
    </Reorder.Item>
  )
}

function CollectionManager({ section }: { section: GuideSection }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const { status, data, error } = useGuideCollection(section.collection)

  const [draft, setDraftState] = useState<GuideDoc[] | null>(null)
  // Mirror in a ref so the drag-end handler always sees the latest order.
  const draftRef = useRef<GuideDoc[] | null>(null)
  const setDraft = (next: GuideDoc[] | null) => {
    draftRef.current = next
    setDraftState(next)
  }
  const [editing, setEditing] = useState<GuideDoc | 'new' | null>(null)
  const [deleting, setDeleting] = useState<GuideDoc | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const items: GuideDoc[] = draft ?? data

  const commitOrder = async () => {
    const current = draftRef.current
    if (!current) return
    const ids = current.map((d) => d.id)
    const changed = ids.some((id, i) => data[i]?.id !== id)
    try {
      if (changed) await reorderGuides(section.collection, ids)
    } catch {
      setSaveError(t('admin.errors.save'))
    } finally {
      setDraft(null)
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteGuide(section.collection, deleting.id)
    } catch {
      setSaveError(t('admin.errors.delete'))
    }
    setDeleting(null)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold">
            <section.Icon className="size-8 text-brand-600" />
            {t(`sections.${section.key}.title`)}
          </h1>
          <p className="mt-1 text-ink/60">{t('admin.list.hint')}</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => setEditing('new')}
          className="rounded-full bg-brand-600 px-5 py-2.5 font-extrabold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700"
        >
          + {t('admin.add')}
        </motion.button>
      </div>

      {(error || saveError) && (
        <p role="alert" className="mt-6 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">
          {saveError ?? t('admin.errors.load')}
        </p>
      )}

      <div className="mt-8">
        {status === 'loading' ? (
          <Spinner />
        ) : items.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-brand-600/20 p-10 text-center text-ink/60">{t('admin.list.empty')}</div>
        ) : (
          <Reorder.Group axis="y" values={items} onReorder={setDraft} className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((doc, i) => (
                <Row
                  key={doc.id}
                  doc={doc}
                  index={i}
                  onEdit={() => setEditing(doc)}
                  onDelete={() => setDeleting(doc)}
                  onDragEnd={commitOrder}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </div>

      <EditorDrawer
        section={section}
        doc={editing === 'new' ? null : editing}
        open={editing !== null}
        nextOrder={data.length}
        onClose={() => setEditing(null)}
      />

      <ConfirmDialog
        open={deleting !== null}
        title={t('admin.confirmDelete.title')}
        body={t('admin.confirmDelete.body', { name: deleting ? l(deleting.title) : '' })}
        confirmLabel={t('admin.delete')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

export function AdminCollectionPage() {
  const { section: slug = '' } = useParams()
  const section = findSection(slug)
  if (!section) return <NotFoundPage />
  // Re-mount per section so local draft/editor state never leaks between collections.
  return <CollectionManager key={section.slug} section={section} />
}
