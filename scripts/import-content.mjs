// Upserts guide content from scripts/content/* into Firestore (doc IDs are stable slugs, so re-running is safe).
//
//   Emulator:   npm run import:content -- --emulator
//   Production: ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run import:content
//               (reads VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID from .env.local;
//                writes go through security rules as that admin user)
import { financialInquiries } from './content/financial.mjs'
import { newOrderProcedures } from './content/new-order.mjs'
import { ticketCategories } from './content/tickets.mjs'

const COLLECTIONS = { ticketCategories, financialInquiries, newOrderProcedures }

const emulator = process.argv.includes('--emulator')
const projectId = emulator ? 'demo-jt-express' : process.env.VITE_FIREBASE_PROJECT_ID
const apiKey = emulator ? 'demo-key' : process.env.VITE_FIREBASE_API_KEY
if (!projectId || !apiKey) throw new Error('Missing VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_API_KEY (use --env-file=.env.local).')

const FIRESTORE = emulator ? 'http://127.0.0.1:8080' : 'https://firestore.googleapis.com'
const AUTH = emulator ? 'http://127.0.0.1:9099/identitytoolkit.googleapis.com' : 'https://identitytoolkit.googleapis.com'
const base = `${FIRESTORE}/v1/projects/${projectId}/databases/(default)/documents`

async function getToken() {
  if (emulator) return 'owner' // emulator-only rules bypass
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env
  if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD for an account listed in admins/{uid}.')
  const res = await fetch(`${AUTH}/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(`Sign-in failed: ${body.error?.message}`)
  return body.idToken
}

/** JS value -> Firestore REST value. */
function encode(value) {
  if (value === null) return { nullValue: null }
  if (value instanceof Date) return { timestampValue: value.toISOString() }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encode) } }
  switch (typeof value) {
    case 'string':
      return { stringValue: value }
    case 'boolean':
      return { booleanValue: value }
    case 'number':
      return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }
    case 'object':
      return { mapValue: { fields: encodeFields(value) } }
    default:
      throw new Error(`Unsupported value: ${value}`)
  }
}
const encodeFields = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined).map(([k, v]) => [k, encode(v)]))

const token = await getToken()
let count = 0
for (const [collection, docs] of Object.entries(COLLECTIONS)) {
  for (const { id, ...data } of docs) {
    const res = await fetch(`${base}/${collection}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ fields: encodeFields({ ...data, updatedAt: new Date() }) }),
    })
    if (!res.ok) throw new Error(`${collection}/${id}: ${res.status} ${await res.text()}`)
    count++
  }
  console.log(`✓ ${collection}: ${docs.length} documents`)
}
console.log(`Imported ${count} documents into ${emulator ? 'the emulator' : projectId}.`)
