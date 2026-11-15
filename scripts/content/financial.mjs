// Financial inquiries guide content (source: customer service team).
// `details` = the customer's case, `employeeActions` = agent steps, `replies` = what to send.
// Rich-text conventions: "• " bullets, "condition ← outcome" rows, [label](https://…) links.

const t = (ar) => ({ ar })
const CALC = t('حساب مبلغ الجمارك')
const DOCS = t('فواتير ومستندات الجمارك')

export const financialInquiries = [
  {
    id: 'customs-calculation-inquiry',
    order: 0,
    icon: '🧾',
    group: CALC,
    title: t('استفسار عن حساب الجمارك'),
    details: t('العميل بيسأل عن حساب الجمارك.'),
    employeeActions: [
      t('راجع آخر تحديث للشحنة للتأكد إن الشحنة وصلت مصر وتم استلامها من المطار / Customs.'),
      t('بعد كده، راجع إذا كان مبلغ الجمارك تم تحديثه على السيستم. لو كل البيانات محدثة والعميل معترض على المبلغ، اسأله عن سبب اعتراضه عليه.'),
    ],
    replies: [{ text: t('خليني أراجع آخر تحديث على شحنتك وأتأكد من مبلغ الجمارك معاك.') }],
  },
  {
    id: 'customs-amount-too-high',
    order: 1,
    icon: '📈',
    group: CALC,
    title: t('مبلغ الجمارك عالي'),
    details: t('العميل بيقول: "مبلغ الجمارك على الشحنة بتاعتي عالي جدًا."'),
    employeeActions: [
      t('وضّح للعميل إن مبلغ الجمارك بيتم حسابه بواسطة مصلحة الجمارك المصرية، وإن دورنا هو فقط إبلاغ العميل بالمبلغ اللي تم تحديده من قِبل الجمارك المصرية.'),
    ],
    replies: [{ text: t('مبلغ الجمارك بيتم تحديده بواسطة مصلحة الجمارك المصرية، ودورنا فقط إننا نبلغك بالمبلغ اللي تم تحديده من قِبل الجمارك المصرية.') }],
  },
  {
    id: 'how-customs-calculated',
    order: 2,
    icon: '🧮',
    group: CALC,
    title: t('إزاي اتحسب مبلغ الجمارك؟'),
    details: t('العميل بيسأل: "إزاي تم حساب مبلغ الجمارك؟"'),
    employeeActions: [
      t('وضّح إن المبلغ بيتم حسابه بناءً على طريقة التقييم المستخدمة من قِبل مصلحة الجمارك المصرية. على سبيل المثال، بالنسبة للملابس، ممكن تكون نسبة الجمارك بشكل عام حوالي 40%–60%، لكن النسبة النهائية ممكن تكون أعلى أو أقل حسب تقييم الجمارك.'),
      t('لو العميل بيسأل عن VAT (قيمة الضريبة المضافة)، وضّح إنها بتتحدد بواسطة الجمارك وبيتم حسابها بنسبة 14% بناءً على قيمة الشحنة + مبلغ الجمارك.'),
    ],
    replies: [
      {
        text: t('مبلغ الجمارك بيتم حسابه حسب طريقة التقييم المستخدمة من قِبل مصلحة الجمارك المصرية. بالنسبة للملابس، النسبة ممكن تكون حوالي 40%–60%، لكن النسبة النهائية ممكن تكون أعلى أو أقل. أما الـ VAT، فبيتم حسابها بنسبة 14% بناءً على قيمة الشحنة بالإضافة إلى مبلغ الجمارك.'),
      },
    ],
  },
  {
    id: 'customs-reassessment',
    order: 3,
    icon: '⚖️',
    group: CALC,
    title: t('طلب إعادة تقييم الجمارك'),
    details: t('العميل بيطلب إعادة تقييم لأنه شايف إن المبلغ غير صحيح.'),
    employeeActions: [
      t(
        [
          'راجع نوع الشحنة:',
          '• TEMU ← راجع قيمة الجمارك مقارنة بقيمة الشحنة، ولو تخطت الـ 100% اعمل تيكت Customs Clearance Dispute.',
          '• SHEIN ← وضّح إن طلبات إعادة التقييم غير متاحة حاليًا من خلالنا.',
        ].join('\n'),
      ),
    ],
    replies: [
      { label: 'TEMU', text: t('هرفع طلبك للفريق المختص وهراجع مع Platform Team إذا كان ممكن إعادة تقييم مبلغ الجمارك لشحنتك.') },
      { label: 'SHEIN', text: t('حاليًا، طلبات إعادة التقييم مش متاحة من خلالنا لشحنات SHEIN.') },
    ],
    relatedTickets: ['customs-clearance-dispute'],
  },
  {
    id: 'customs-invoice-inquiry',
    order: 4,
    icon: '📧',
    group: DOCS,
    title: t('استفسار عن فاتورة الجمارك'),
    details: t('العميل بيسأل عن فاتورة الجمارك.'),
    employeeActions: [
      t(
        [
          'اسأل العميل إذا كان استلم البيان الجمركي عن طريق الإيميل:',
          '• لو لأ ← افتح تيكت Customs Clearance Dispute.',
          '• لو اتبعتله ← وضّح إن البيان الجمركي بيوضح مبلغ الجمارك بالضبط كما تم استلامه من مصلحة الجمارك المصرية.',
        ].join('\n'),
      ),
    ],
    replies: [{ text: t('هل استلمت البيان الجمركي على الإيميل؟ المستند ده بيوضح مبلغ الجمارك بالضبط زي ما تم تحديده من قِبل الجمارك المصرية.') }],
    relatedTickets: ['customs-clearance-dispute'],
  },
  {
    id: 'official-document-request',
    order: 5,
    icon: '📄',
    group: DOCS,
    title: t('طلب مستند رسمي'),
    details: t('العميل بيقول: "الفاتورة دي من شركتكم، وأنا محتاج مستند رسمي."'),
    employeeActions: [t('اعمل تيكت Customs Clearance Dispute، وأضف طلب العميل وسبب احتياجه للفاتورة.')],
    replies: [{ text: t('فاهم طلبك. هعمل تذكرة لفريق Platform Team بالطلب بتاعك. الفريق هيراجع الحالة ويتواصل معاك.') }],
    relatedTickets: ['customs-clearance-dispute'],
    note: t('فريق الـ Platform هيتواصل مع العميل وينسّق معاه بخصوص طلبه.'),
  },
  {
    id: 'invoices-with-shipments',
    order: 6,
    icon: '📦',
    group: DOCS,
    title: t('فواتير الجمارك مع الشحنات'),
    details: t('العميل بيقول: "كل الشحنات اللي بتخرج من الجمارك بتيجي معاها فواتير الجمارك."'),
    employeeActions: [
      t('وضّح إن الشحنات اللي بتخرج من الجمارك بيكون معاها بيان جمركي صادر من PDC عن طريق الإيميل.'),
      t('المستند ده بيتم استخدامه لتأكيد مبلغ الجمارك. ولو العميل محتاجه، افتح تيكت Customs Clearance Dispute.'),
    ],
    replies: [
      { text: t('الشحنات اللي بتخرج من Customs بيكون معاها البيان الجمركي صادر من Egypt Post عن طريق الإيميل. المستند ده بيأكد مبلغ الجمارك، وممكن كمان نشارك معاك Screenshot منه لو احتجت.') },
    ],
    relatedTickets: ['customs-clearance-dispute'],
  },
  {
    id: 'stamped-invoice',
    order: 7,
    icon: '🔖',
    group: DOCS,
    title: t('طلب فاتورة جمركية مختومة'),
    details: t('العميل عايز الفاتورة الجمركية مختومة.'),
    employeeActions: [t('اعمل تيكت Customs Clearance Dispute، وأضف طلب العميل وسبب احتياجه للفاتورة.')],
    replies: [
      { text: t('حاضر، هعمل لك تذكرة لفريق Platform Team بالطلب بتاعك. الفريق هيراجع الحالة، وهيتواصل معاك لو احتاج أي معلومات إضافية، وهيأكد إذا كانت Customs Invoice مختومة مطلوبة.') },
    ],
    relatedTickets: ['customs-clearance-dispute'],
    note: t('فريق الـ Platform هيتواصل مع العميل وينسّق معاه بخصوص طلبه.'),
  },
]
