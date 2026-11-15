import { normalizeSearch } from '@/features/guides/search'

/**
 * Prohibited & rejected items (source: "دليل المواد الممنوعة والمرفوضة", Safety & Operations).
 * `keywords` hold everyday/colloquial words agents and customers actually use, so the checker matches them.
 */

export type ProhibitedItem = { name: string; details?: string; keywords: string[] }
export type ProhibitedCategory = { id: string; icon: string; title: string; items: ProhibitedItem[] }
export type AllowedException = { name: string; keywords: string[]; reason: string }

export const GENERAL_RULE = {
  title: 'المواد الحساسة سهلة الكسر',
  body: 'يُمنع تمامًا استلام الشحنات التي تفتقر إلى المتانة الكافية وتكون عرضة للكسر أو التلف بسهولة أثناء النقل والتداول أو نتيجة لضغط الشحنات فوق بعضها أثناء التكديس (المنتجات القوية والصلبة التي لا تتأثر بظروف الشحن الطبيعية مسموح بها).',
  keywords: ['زجاج', 'ازاز', 'قزاز', 'سيراميك', 'صيني', 'فخار', 'مراية', 'مرايه', 'كاسات', 'نجف', 'سهل الكسر', 'قابل للكسر', 'fragile', 'glass'],
}

export const PROHIBITED_CATEGORIES: ProhibitedCategory[] = [
  {
    id: 'liquids-gases',
    icon: '💧',
    title: 'السوائل والغازات والثلوج',
    items: [
      { name: 'جميع أنواع السوائل', details: 'سواء كانت قابلة للاشتعال أو غير قابلة للاشتعال (كالمواد الكيميائية السائلة، الزيوت الصناعية، الدهانات، التنر، إلخ).', keywords: ['سوائل', 'سائل', 'مية', 'مياه', 'عصير', 'زيت', 'زيوت', 'دهان', 'دهانات', 'بويه', 'تنر', 'برفان', 'بارفان', 'برفيوم', 'عطر', 'عطور', 'شامبو', 'لوشن', 'كحول', 'كلور', 'منظفات', 'perfume', 'liquid', 'oil'] },
      { name: 'جميع أنواع الغازات المضغوطة', details: 'مثل عبوات الرش المضغوطة والولاعات بجميع أنواعها، وغيرها.', keywords: ['غاز', 'غازات', 'بخاخ', 'سبراي', 'اسبراي', 'spray', 'ولاعة', 'ولاعه', 'قداحة', 'انبوبة', 'أنبوبة', 'مزيل عرق', 'lighter'] },
      { name: 'الثلج العادي والثلج الجاف', details: 'لمنع الذوبان والتسريب أو انبعاث الغازات في الأماكن المغلقة.', keywords: ['ثلج', 'تلج', 'ثلج جاف', 'dry ice', 'ice'] },
    ],
  },
  {
    id: 'hazardous',
    icon: '🔥',
    title: 'المواد الخطرة وسريعة التلف حراريًا',
    items: [
      { name: 'الفحم بجميع أنواعه وأعواد الكبريت', keywords: ['فحم', 'كبريت', 'شخاط', 'charcoal', 'matches'] },
      { name: 'المتفجرات، الأسلحة، والذخائر بمختلف أنواعها', keywords: ['متفجرات', 'سلاح', 'اسلحة', 'أسلحة', 'ذخيرة', 'رصاص', 'طبنجة', 'مسدس', 'بندقية', 'صواريخ', 'بمب', 'شماريخ', 'العاب نارية', 'gun', 'weapon'] },
      { name: 'المنتجات الحساسة للحرارة العالية', details: 'التي قد تذوب أو تسيح نتيجة ظروف الشحن الطبيعية وحرارة السيارات (مثل الشموع أو بعض مستحضرات التجميل الصلبة).', keywords: ['شمع', 'شموع', 'candle', 'مستحضرات تجميل صلبة'] },
    ],
  },
  {
    id: 'radioactive-toxic',
    icon: '☢️',
    title: 'المواد المشعة والسامة والمغناطيسية',
    items: [
      { name: 'المواد المشعة والأجهزة الطبية الإشعاعية', keywords: ['مشع', 'مشعة', 'اشعاع', 'إشعاع', 'اشعة', 'radioactive'] },
      { name: 'المواد المغناطيسية القوية غير المعزولة', details: 'لأنها تؤثر سلبًا على الأجهزة الإلكترونية المشحونة معها في نفس الحاوية.', keywords: ['مغناطيس', 'مغناطيسي', 'مغناطيسية', 'magnet'] },
      { name: 'المواد السامة والبيولوجية', details: 'مثل العينات الطبية أو المخبرية، العينات الكيميائية، والمبيدات الحشرية.', keywords: ['سم', 'سموم', 'سامة', 'مبيد', 'مبيدات', 'عينة', 'عينات', 'تحاليل', 'كيماويات', 'كيميائية', 'poison'] },
    ],
  },
  {
    id: 'electronics',
    icon: '📱',
    title: 'الأجهزة والبطاريات والتبغ الإلكتروني',
    items: [
      { name: 'البطاريات بجميع أنواعها وأشكالها', details: 'ممنوعة منعًا باتًا سواء منفصلة أو داخل الأجهزة.', keywords: ['بطارية', 'بطاريه', 'بطاريات', 'باور بانك', 'power bank', 'battery', 'شاحن متنقل'] },
      { name: 'الأجهزة الإلكترونية والكهربائية', details: 'بما يشمل الهواتف، اللابتوبات، التابلت، وكذلك الأجهزة المنزلية الكبيرة (كالغسالات والثلاجات).', keywords: ['موبايل', 'تليفون', 'هاتف', 'ايفون', 'آيفون', 'سامسونج', 'لابتوب', 'لاب توب', 'كمبيوتر', 'تابلت', 'ايباد', 'آيباد', 'ساعة ذكية', 'سماعة', 'سماعات', 'شاحن', 'تلفزيون', 'شاشة', 'غسالة', 'تلاجة', 'ثلاجة', 'خلاط', 'مكواة', 'سشوار', 'كهربائي', 'كهربا', 'الكتروني', 'إلكتروني', 'الكترونيات', 'phone', 'laptop', 'tablet'] },
      { name: 'التبغ والسجائر الإلكترونية', details: 'خطورة تشغيلية لاحتوائها على سوائل وبطاريات مدمجة.', keywords: ['سجاير', 'سجائر', 'دخان', 'تبغ', 'فيب', 'vape', 'شيشة', 'معسل', 'سيجارة الكترونية'] },
    ],
  },
  {
    id: 'medical-organic',
    icon: '🌿',
    title: 'المواد الطبية والعضوية',
    items: [
      { name: 'الأدوية والعلاجات الطبية بجميع أنواعها', keywords: ['دوا', 'دواء', 'ادوية', 'أدوية', 'علاج', 'حبوب', 'مكملات', 'فيتامينات', 'حقن', 'medicine'] },
      { name: 'الأطعمة والمأكولات الجاهزة أو الطازجة', details: 'المأكولات المطبوخة أو سريعة التلف (بينما المواد الجافة مثل الأرز والمكرونة والبن غير المطبوخ مسموح بها).', keywords: ['اكل', 'أكل', 'طعام', 'مأكولات', 'محشي', 'لحمة', 'لحم', 'فراخ', 'سمك', 'جبنة', 'لبن', 'حلويات', 'كيك', 'تورتة', 'فاكهة', 'فواكه', 'خضار', 'خضروات', 'food'] },
      { name: 'الحيوانات الحية، البخور، والنباتات أو الزهور الطبيعية', details: 'بينما البذور الجافة مسموح بشحنها بشكل طبيعي.', keywords: ['حيوان', 'حيوانات', 'قطة', 'كلب', 'عصافير', 'فراخ حية', 'بخور', 'نبات', 'نباتات', 'زرع', 'ورد', 'زهور', 'شتلة', 'plants', 'flowers'] },
    ],
  },
  {
    id: 'valuables-documents',
    icon: '💎',
    title: 'المقتنيات الثمينة والوثائق القانونية',
    items: [
      { name: 'الذهب، الفضة، والمجوهرات الثمينة', keywords: ['دهب', 'ذهب', 'فضة', 'فضه', 'مجوهرات', 'الماظ', 'ألماظ', 'خاتم', 'سلسلة', 'gold', 'jewelry'] },
      { name: 'التحف والأعمال الفنية النادرة', details: 'مثل اللوحات الأصلية، الأنتيكات، والتماثيل الاستثنائية التي يصعب تعويضها.', keywords: ['تحفة', 'تحف', 'انتيك', 'أنتيكات', 'لوحة', 'لوحات', 'تمثال', 'تماثيل', 'antique'] },
      { name: 'الأموال والوثائق الرسمية الأصلية', details: 'المبالغ النقدية، الشيكات، بطاقات الائتمان، السبائك، جوازات السفر، البطاقات الشخصية، التوكيلات، والعقود القانونية.', keywords: ['فلوس', 'نقود', 'كاش', 'شيك', 'شيكات', 'فيزا', 'كريدت', 'بطاقة', 'بطاقات', 'سبائك', 'باسبور', 'جواز سفر', 'بطاقة شخصية', 'توكيل', 'عقد', 'عقود', 'ورق رسمي', 'مستندات', 'cash', 'passport'] },
    ],
  },
  {
    id: 'general-legal',
    icon: '⛔',
    title: 'ممنوعات عامة وقانونية',
    items: [
      { name: 'الأدوات والقطع الحادة بجميع أنواعها', details: 'تُمنع نهائيًا بغض النظر عن طريقة تغليفها.', keywords: ['سكينة', 'سكين', 'سكاكين', 'مقص', 'شفرة', 'موس', 'منشار', 'ابر', 'إبر', 'حاد', 'حادة', 'knife'] },
      { name: 'الدراجات النارية (الموتوسيكلات)', keywords: ['موتوسيكل', 'موتسيكل', 'اسكوتر', 'سكوتر', 'دراجة نارية', 'motorcycle'] },
      { name: 'المواد الإباحية والمخدرات بجميع أنواعها', keywords: ['مخدرات', 'حشيش', 'بانجو', 'اباحي', 'إباحية'] },
    ],
  },
]

export type Verdict =
  | { kind: 'empty' }
  | { kind: 'prohibited'; hits: { category: ProhibitedCategory; item: ProhibitedItem }[] }
  | { kind: 'fragile' }
  | { kind: 'allowed'; reason: string; name: string }
  | { kind: 'unknown' }

/**
 * Whole-word matching so short keywords don't fire inside other words ("بن" ≠ "بنطلون").
 * Multi-word keywords match as phrases; a token may carry the Arabic article "ال";
 * long keywords also match as a prefix (plurals/suffixes), and a partially typed token (3+ chars) matches its keyword.
 */
function matchesKeyword(tokens: string[], phrase: string, keyword: string) {
  const k = normalizeSearch(keyword)
  if (!k) return false
  if (k.includes(' ')) return ` ${phrase} `.includes(` ${k} `)
  return tokens.some((tok) => {
    const bare = tok.startsWith('ال') && tok.length > 3 ? tok.slice(2) : tok
    return bare === k || tok === k || (k.length >= 4 && bare.startsWith(k)) || (bare.length >= 3 && k.length > bare.length && k.startsWith(bare))
  })
}

export function checkItem(raw: string): Verdict {
  const phrase = normalizeSearch(raw)
  if (phrase.length < 2) return { kind: 'empty' }
  const tokens = phrase.split(' ')
  const hit = (words: string[]) => words.some((w) => matchesKeyword(tokens, phrase, w))

  const hits = PROHIBITED_CATEGORIES.flatMap((category) => category.items.filter((item) => hit(item.keywords)).map((item) => ({ category, item })))
  if (hits.length) return { kind: 'prohibited', hits }
  if (hit(GENERAL_RULE.keywords)) return { kind: 'fragile' }
  const allowed = ALLOWED_EXCEPTIONS.find((a) => hit(a.keywords))
  if (allowed) return { kind: 'allowed', reason: allowed.reason, name: allowed.name }
  return { kind: 'unknown' }
}

/** Explicitly allowed exceptions mentioned in the guide. */
export const ALLOWED_EXCEPTIONS: AllowedException[] = [
  { name: 'المواد الغذائية الجافة', keywords: ['رز', 'أرز', 'ارز', 'مكرونة', 'بن', 'قهوة', 'عدس', 'فول', 'بقوليات', 'سكر', 'دقيق'], reason: 'المواد الجافة غير المطبوخة مثل الأرز والمكرونة والبن مسموح بها.' },
  { name: 'البذور الجافة', keywords: ['بذور', 'تقاوي'], reason: 'البذور الجافة مسموح بشحنها بشكل طبيعي.' },
]
