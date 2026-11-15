// Ticket types guide content (source: customer service team).
// Rich-text conventions used by the app:
//   "• " at line start  -> bullet
//   "A ← B"             -> condition → outcome row
//   [label](https://…)  -> external link
// Ticket names stay in English because they match the names in the ticketing system.

const t = (ar) => ({ ar })

export const ticketCategories = [
  {
    id: 'expediting-sla',
    order: 0,
    icon: '⚡',
    title: t('Expediting & SLA Requests'),
    description: t('طلبات تسريع الاستلام أو التسليم، والشكاوى من تأخير الشحنة عن المواعيد المتفق عليها أو توقف التحديثات عليها.'),
    subtypes: [
      {
        id: 'pickup-acceleration',
        title: t('Pickup Acceleration'),
        whenToUse: t('لما العميل يطلب تسريع إستلام الشحنة، مع إن الشحنة لسه في الوقت المتفق عليه.'),
        note: t(
          [
            '• لو الراسل اللي بيتواصل معانا سواء كان VIP او لأ ← نفتح التيكت عادي.',
            '• لو المستلم اللي بيتواصل معانا والشحنة كاش ← نفتح التيكت عادي.',
            '• لو المستلم اللي بيتواصل معانا والشحنة من عميل VIP ← مش هنفتح تيكت ونبلغ العميل يرجع للشيبر.',
          ].join('\n'),
        ),
      },
      {
        id: 'delivery-acceleration',
        title: t('Delivery Acceleration'),
        whenToUse: t('لما العميل يطلب تسريع تسليم الشحنة، مع إن الشحنة لسه في الوقت المتفق عليه.'),
      },
      {
        id: 'delayed-pickup',
        title: t('Delayed Pickup'),
        whenToUse: t('لما العميل يشتكي إن الشحنة لسه المندوب مستلمهاش وموعد الاستلام عدى.'),
      },
      {
        id: 'delayed-delivery',
        title: t('Delayed Delivery'),
        whenToUse: t('لما العميل يشتكي إن الشحنة لسه متسلمتش وموعد التسليم عدى.'),
      },
      {
        id: 'delayed-return',
        title: t('Delayed Return'),
        whenToUse: t('لما العميل يشتكي إن الشحنة إتاخرت في رجوعها عن الميعاد المحدد.'),
      },
      {
        id: 'miss-sorting',
        title: t('Miss-Sorting'),
        whenToUse: t('لما الشحنة تكون راحت فرع غير الفرع اللي المفروض يسلمها أو يرجعها.'),
      },
      {
        id: 'no-tracking-update',
        title: t('No Tracking Update'),
        whenToUse: t('لما العميل يشتكي إن الشحنة مفيش عليها أي تحديث بقالها أكتر من 48 ساعة وعايز يعرف إيه اللي بيحصل.'),
        note: t('لو المدة دي تجاوزت 7 أيام، وقتها التيكت هتبقى لـ Claim → Lost.'),
      },
    ],
  },
  {
    id: 'change-information',
    order: 1,
    icon: '✏️',
    title: t('Change Information / Request'),
    description: t('طلبات تعديل بيانات الشحنة أو الحساب زي العنوان ورقم الموبايل وموعد التسليم، وطلبات الإرجاع أو إلغاؤه.'),
    subtypes: [
      {
        id: 'change-delivery-address',
        title: t('Change Delivery Address'),
        whenToUse: t('لما العميل يطلب تغيير عنوان التسليم.'),
        note: t('تغيير العنوان متاح مرة واحدة فقط، ومتاح لشحنات SHEIN وTEMU وCIB وNBE فقط.'),
      },
      {
        id: 'change-contract-information',
        title: t('Change Contract Information'),
        whenToUse: t('لما العميل يطلب تعديل في بيانات الحساب زي ( الحساب البنكي / رقم الموبايل / طريقة تحويل الفلوس / ... ).'),
      },
      {
        id: 'change-add-phone-number',
        title: t('Change/Add Phone Number'),
        whenToUse: t('لما العميل يطلب تغيير أو إضافة رقم الموبايل.'),
        note: t('لازم تتأكد إن الرقم اللي هيتغير او هيتضاف يكون 11 رقم.'),
      },
      {
        id: 'change-delivery-time',
        title: t('Change Delivery Time'),
        whenToUse: t('لما العميل يطلب تغيير موعد التسليم.'),
        note: t('أقصى مدة لتأجيل الشحنة هي 7 أيام من تاريخ وصولها لفرع التسليم لكل الشحنات، ما عدا شحنات SHEIN و TEMU المسموح ليهم بالتأجيل لحد 27 يوم.'),
      },
      {
        id: 'request-for-return',
        title: t('Request for Return'),
        whenToUse: t('لما العميل يطلب إرجاع الشحنة.'),
        note: t('التيكت دي بتتفتح فقط لو الشحنة لسه متسلمتش، لكن لو الشحنة اتسلمت خلاص والعميل محتاج يرجعها، بنبلغه يتواصل مباشرةً مع الشيبر.'),
      },
      {
        id: 'cancel-return',
        title: t('Cancel Return'),
        whenToUse: t('لما العميل يطلب إلغاء الـ Return اللي على الشحنة.'),
        note: t('بنفتح التيكت في حالة إن الشحنة يكون عليها scan (Returned parcel registration أو Returned parcel scan)، أو يكون في تيكت (Request for Return) اتفتحت على الشحنة واتقفلت.'),
      },
    ],
  },
  {
    id: 'service-quality',
    order: 2,
    icon: '📣',
    title: t('Service Quality Complaints'),
    description: t('شكاوى جودة الخدمة: أخطاء في حالة الشحنة على السيستم، أو تحديثات غير حقيقية، أو أسلوب المندوب أو موظفي الفرع.'),
    subtypes: [
      {
        id: 'delivered-but-not-signed',
        title: t('Delivered But Not Signed'),
        whenToUse: t('لما تكون الشحنة على السيستم مش متسلمة مع إن العميل إستلمها.'),
      },
      {
        id: 'false-sign',
        title: t("Didn't Receive Shipment (False Sign)"),
        whenToUse: t('لما تكون الشحنة على السيستم متسلمة مع إن العميل بيأكد إنه مستلمهاش.'),
        note: t('لازم نراجع من العميل الـ (POD) (إثبات التسليم) ونتأكد إن مفيش حد من الجيران او من البيت استلمها قبل ما نفتح التيكت.'),
      },
      {
        id: 'false-pickup-status',
        title: t('False Pickup Status'),
        whenToUse: t('لما تظهر الشحنة على السيستم إنها اتعملها Pick up، بينما فعليًا لم تتم عملية إستلام الشحنة.'),
      },
      {
        id: 'fake-update',
        title: t('Fake Update'),
        whenToUse: t('لما العميل يشتكي إن الابنورمال اللي على الشحنة مش حقيقي.'),
        note: t('لازم يكون ابنورمال يخص العميل بشكل مباشر زي ( الرفض / التأجيل / لم يرد / ... ) ولازم نراجع الاسكرينات اللي المندوب رافعها ونتأكد من رقم الموبايل اللي المندوب اتصل بيه او بعتله على الواتس اب.'),
      },
      {
        id: 'courier-refused',
        title: t('Courier Refused to Deliver the Order & Courier Refused to Pick up the Order'),
        whenToUse: t('لما العميل يوضح إن المندوب رفض تسليم / إستلام الشحنة.'),
        note: t('لازم نفهم من العميل ايه اللي حصل بالظبط ونتأكد هو عنوانه مخدوم ولا لأ من لينك الأماكن المحظورة [Remote Areas](https://jtexpress.sg.feishu.cn/sheets/Hwbistx1IhopSCtZulklQ7odgDe?sheet=Jrd1jI).'),
      },
      {
        id: 'return-wrong-shipment-cod',
        title: t('Return Wrong Shipment (COD Collected)'),
        whenToUse: t('لو الراسل او المستلم بيكلمنا وبيشتكي إن الشحنة تم تسليمها للمستلم ودفع فلوسها للمندوب لكن حالة الشحنة رجعت للراسل او اخدت امر الرجوع واتوافق عليه وخرجت من الفرع وفي طريقها للراسل.'),
      },
      {
        id: 'courier-bad-attitude',
        title: t('Courier Bad Attitude'),
        whenToUse: t('لما العميل يشتكي من اسلوب المندوب معاه ( قفل في وشه / شتمه / إتكلم بإسلوب مش كويس معاه / ... ).'),
      },
      {
        id: 'non-courier-bad-attitude',
        title: t('Non-Courier Bad Attitude'),
        whenToUse: t('لما العميل يشتكي من اسلوب موظف الفرع/مدير الفرع معاه (قفل في وشه / شتمه / إتكلم بإسلوب مش كويس معاه / ... ).'),
      },
      {
        id: 'courier-charged-extra-money',
        title: t('Courier Charged Extra Money'),
        whenToUse: t('لما العميل يوضح إن المندوب طلب أو حصل منه تحصيل مبلغ أعلى من قيمة الشحن ( في حالة البيك اب ) أو المبلغ المستحق عند الاستلام (COD).'),
      },
    ],
  },
  {
    id: 'claims',
    order: 3,
    icon: '🛡️',
    title: t('Claims'),
    description: t('طلبات التعويض عن الشحنات المفقودة أو التالفة أو الناقصة أو المستبدلة، أو اللي رجعت من غير محاولة توصيل صحيحة.'),
    rules: [
      t('لازم الراسل اللي يكون بيكلمني ماعدا شحنات تيمو.'),
      t('لازم حالة الشحنه تكون Signing scan او Return Sign إلا في حالات الـ Lost.'),
      t('لازم نبلغ العميل إن التواصل هيكون في خلال 24 ساعة عمل.'),
    ],
    subtypes: [
      {
        id: 'claims-others',
        title: t('Others'),
        whenToUse: t(
          [
            '• لما المندوب يسلّم الشحنة ومايتعملش Sign Scan على السيستم، والفرع ما يحلش المشكلة، يتم إنشاء تذكرة لقسم التعويضات لحل المشكلة.',
            '• لما المندوب يحصّل مبلغ زيادة عن المبلغ المطلوب على السيستم، والفرع ما يحلش المشكلة، والعميل يطلب تعويض عن فرق المبلغ وإرساله للعميل.',
            '• لما المندوب يسمح للمستلم بمعاينة الشحنة بدون تعليمات من الراسل بالسماح بالمعاينة، أو يمنع المعاينة رغم وجود تعليمات من الراسل بالسماح بها.',
          ].join('\n'),
        ),
      },
      {
        id: 'lost-item',
        title: t('Lost Item'),
        whenToUse: t('لما العميل يشتكي إن الشحنة مفقودة.'),
        note: t(
          [
            'بنعتبر إن الشحنة مفقودة في الحالات الاتية:',
            '• يكون اخر تحديث على الشحنة عدى عليه اكتر من 7 أيام.',
            '• يكون في ابنورمال Lost.',
            '• يكون في تيكت مفتوحة وفي رد من الفرع إنها Lost.',
          ].join('\n'),
        ),
      },
      {
        id: 'damaged-item',
        title: t('Damaged Item'),
        whenToUse: t(
          [
            '• الراسل عايز يتعوض عشان الشحنة اتسلمت او رجعتله مكسوره (لازم يبلغنا في خلال يومين من وقت ما يستلم الشحنة).',
            '• المستلم استلم الشحنة ولما استلمها كانت مكسوره (لازم تكون شحنة تيمو او SHEIN عشان اقدر افتح التيكت).',
          ].join('\n'),
        ),
      },
      {
        id: 'swapped-item',
        title: t('Swapped Item'),
        whenToUse: t(
          [
            '• الراسل عايز يتعوض عشان الشحنة اتسلمت او رجعتله حاجه غير اللي كان باعتها (لازم يبلغنا في خلال يومين من وقت ما يستلم الشحنة).',
            '• المستلم استلم الشحنة ولما استلمها كانت غير اللي هو طالبه (لازم تكون شحنة تيمو او SHEIN ولازم اتأكد من إسم المنتج عندي على السيستم عشان اقدر افتح التيكت).',
          ].join('\n'),
        ),
      },
      {
        id: 'shortage-partial-loss',
        title: t('Shortage/Partial Loss'),
        whenToUse: t(
          [
            '• الراسل عايز يتعوض عشان الشحنة اتسلمت او رجعتله ناقصه (لازم يبلغنا في خلال يومين من وقت ما يستلم الشحنة).',
            '• المستلم استلم الشحنة ولما استلمها كانت ناقصة (لازم تكون شحنة تيمو او SHEIN ولازم اتأكد من عدد القطع عندي على السيستم عشان اقدر افتح التيكت).',
          ].join('\n'),
        ),
      },
      {
        id: 'fake-return',
        title: t('Returned Without Delivery Attempt (Fake Return)'),
        whenToUse: t(
          [
            '• الراسل عايز يتعوض عشان الشحنة رجعتله بدون محاولة توصيل صحيحة (لازم يبلغنا في خلال 5 ايام من وقت ما يستلم الشحنة).',
            '• الراسل عايز يتعوض عشان الشحنة رجعت بسبب فيك ابديت من المندوب (لازم يبلغنا في خلال 5 ايام من وقت ما يستلم الشحنة).',
          ].join('\n'),
        ),
      },
    ],
  },
  {
    id: 'financial-issues',
    order: 4,
    icon: '💰',
    title: t('Financial Issues'),
    description: t('مشاكل التحويلات المالية، والاعتراض على حساب وزن الشحنة أو الرسوم الجمركية.'),
    subtypes: [
      {
        id: 'financial-issues',
        title: t('Financial Issues'),
        whenToUse: t('لما العميل يشتكي من مشكلة تخص التحويلات المالية.'),
        note: t(
          [
            'مواعيد التحويل:',
            '• الشحنات اللي تم تسليمهم أيام الأربعاء / الخميس ← التحويل هيكون يوم الأحد.',
            '• الشحنات اللي تم تسليمهم أيام الجمعة / السبت / الأحد ← التحويل هيكون يوم الثلاثاء.',
            '• الشحنات اللي تم تسليمهم أيام الاثنين / الثلاثاء ← التحويل هيكون يوم الخميس.',
          ].join('\n'),
        ),
      },
      {
        id: 'wrong-weight-calculation',
        title: t('Wrong Weight Calculation'),
        whenToUse: t('لما العميل يشتكي إن رسوم الشحن اتحسبت بشكل غير صحيح بسبب حساب وزن الشحنة بشكل خاطئ.'),
      },
      {
        id: 'customs-clearance-dispute',
        title: t('Customs Clearance Dispute'),
        whenToUse: t('لما العميل يعترض على المبلغ الجمركي أو يواجه مشكلة متعلقة بالرسوم الجمركية (شحنات TEMU) فقط.'),
      },
    ],
  },
]
