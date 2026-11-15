/** Normalise Arabic + Latin text for forgiving search (diacritics, alef/ya/ta-marbuta forms, case). */
export function normalizeSearch(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ً-ٰٟـ]/g, '') // tashkeel + tatweel
    .replace(/[آأإ]/g, 'ا') // آ أ إ -> ا
    .replace(/ى/g, 'ي') // ى -> ي
    .replace(/ة/g, 'ه') // ة -> ه
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** True for Latin-only strings such as ticket system names ("Pickup Acceleration"). */
export const isLatin = (text: string) => /^[\p{Script=Latin}\p{N}\p{P}\p{S}\p{Zs}]+$/u.test(text)

/** Every query word must appear somewhere in the haystack. */
export function matches(haystack: string, query: string) {
  const q = normalizeSearch(query)
  if (!q) return true
  const h = normalizeSearch(haystack)
  return q.split(' ').every((word) => h.includes(word))
}
