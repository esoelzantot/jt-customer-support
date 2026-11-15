import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

/**
 * Plain-language summary of "شروط وأحكام العملاء النقديين — عقد خدمة التوصيل الشخصي"
 * (the paper the sender signs at pickup). The original scan isn't embedded on purpose.
 */
const CLAUSES = [
  {
    icon: '📄',
    title: 'الخدمة والرسوم',
    points: [
      'العميل (المرسل) بيكلّف J&T Express مصر بنقل الشحنة من عنوان الشحن لعنوان التسليم.',
      'رسوم التوصيل بتتدفع نقدًا أو أونلاين عند تسليم الشحنة للمندوب.',
      'لازم يتكتب في العقد بيانات الشحنة: الاسم، واللون، والكمية.',
    ],
  },
  {
    icon: '🙋',
    title: 'مسؤوليات العميل',
    points: [
      'يضمن إن كل المواد المرسلة قانونية، ويقدّم معلومات دقيقة وصحيحة عنها.',
      'يكمّل بيانات الشحنة بدقة، ويغلّفها بشكل مناسب، ويفصح عن طبيعة محتواها.',
      'يتحمّل مسؤولية أي أضرار أو تأخير بسبب معلومات غير دقيقة أو غير مكتملة.',
      'ممنوع تمامًا شحن مواد خطرة أو غير قانونية، والعميل يتحمّل المسؤولية الكاملة عن أي مخالفة.',
    ],
  },
  {
    icon: '⏱️',
    title: 'مواعيد المطالبات',
    points: ['فقدان الشحنة ← لازم يبلغ J&T خلال 30 يوم من تاريخ الشحنة.', 'تلف الشحنة ← لازم يبلغ خلال يومين من استلام الشحنة.', 'أي مطالبة بعد المدة دي مش هتتقبل.'],
  },
  {
    icon: '🛡️',
    title: 'التعويضات والاستثناءات',
    points: [
      'فقدان الشحنة ← 5 أضعاف رسوم الشحن (بحد أقصى 500 جنيه) أو قيمة الشحنة، أيهما أقل.',
      'تلف الشحنة ← ضعف رسوم الشحن (بحد أقصى 200 جنيه) أو قيمة الشحنة، أيهما أقل.',
      'مفيش تعويض عن تلف الشحنات القابلة للكسر وعالية المخاطر، زي الزجاج والسيراميك والسوائل والفواكه والخضروات، أو أي عناصر محظورة.',
    ],
  },
  {
    icon: '⚖️',
    title: 'أحكام عامة',
    points: [
      'J&T بتلتزم بالجدول الزمني للتسليم، لكنها مش مسؤولة عن التأخير أو الفشل بسبب ظروف قهرية (كوارث طبيعية، قيود حكومية، إضرابات)، مع إبلاغ العميل فورًا.',
      'J&T من حقها تحصيل الرسوم المتفق عليها وأي رسوم إضافية مطبقة بموجب العقد أو القانون.',
      'J&T مش مسؤولة عن الأضرار غير المباشرة أو التبعية (زي فقدان الأرباح أو الفرص التجارية).',
      'أي نزاع بيخضع لقوانين جمهورية مصر العربية.',
    ],
  },
]

export function TermsSummary() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(0)

  return (
    <div className="grid gap-5 md:grid-cols-[13rem_1fr]">
      {/* Paper visual */}
      <div className="relative hidden h-full min-h-64 overflow-hidden rounded-[1.5rem] bg-white p-5 shadow-card ring-1 ring-line md:block" aria-hidden>
        <p className="text-center text-xs font-bold text-ink">شروط وأحكام العملاء النقديين</p>
        <div className="mt-4 space-y-2">
          {[90, 75, 85, 60, 80, 70, 88, 55].map((w, i) => (
            <span key={i} className="block h-1.5 rounded-full bg-cream" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="absolute inset-x-5 bottom-6">
          <svg viewBox="0 0 160 40" className="h-10 w-full text-brand-600">
            <motion.path
              d="M5 28 C 20 5, 30 35, 45 18 S 70 30, 85 14 S 110 34, 125 20 S 145 12, 155 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
          </svg>
          <span className="mt-1 block h-px bg-ink-300" />
          <p className="mt-1 text-center text-[10px] text-ink-500">توقيع الراسل</p>
        </div>
      </div>

      {/* Clauses */}
      <div className="space-y-2.5">
        {CLAUSES.map((c, i) => {
          const isOpen = open === i
          return (
            <div key={c.title} className={clsx('overflow-hidden rounded-2xl bg-white ring-1 transition-colors', isOpen ? 'ring-brand-200' : 'ring-line')}>
              <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center gap-3 p-4 text-start">
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-xl bg-cream text-lg">{c.icon}</span>
                <span className="min-w-0 flex-1 font-semibold">{c.title}</span>
                <span className="text-xs text-ink-500">{t('newOrder.terms.points', { count: c.points.length })}</span>
                <svg viewBox="0 0 24 24" className={clsx('size-4 shrink-0 text-ink-500 transition-transform', isOpen && 'rotate-180')} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <ul className="space-y-2 px-4 pb-4">
                      {c.points.map((p) => (
                        <li key={p} className="flex gap-2.5 text-[0.95rem] leading-7 text-ink-700">
                          <span aria-hidden className="mt-[0.75em] size-1.5 shrink-0 rounded-full bg-brand-600" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
