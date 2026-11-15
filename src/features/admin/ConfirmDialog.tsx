import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/** Native <dialog>: focus trap, Esc and backdrop come for free. */
export function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel }: Props) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      onClick={(e) => e.target === ref.current && onCancel()}
      className="m-auto w-[min(26rem,calc(100%-2rem))] rounded-3xl bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <h2 className="text-xl font-extrabold">{title}</h2>
        <p className="mt-2 text-ink/70">{body}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-full px-5 py-2 font-bold text-ink/70 hover:bg-ink/5">
            {t('admin.cancel')}
          </button>
          <button type="button" onClick={onConfirm} className="rounded-full bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-700">
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
