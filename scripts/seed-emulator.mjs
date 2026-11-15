// Seeds the LOCAL Firebase emulators with test accounts. Never points at production.
// Usage: npm run emulators   (in another terminal)  then  npm run seed:emulator
const PROJECT = 'demo-jt-express'
const AUTH = 'http://127.0.0.1:9099'
const FIRESTORE = 'http://127.0.0.1:8080'

// Emulator-only test accounts.
export const TEST_USERS = {
  admin: { email: 'admin@jt.test', password: 'emulator-admin-123' },
  agent: { email: 'agent@jt.test', password: 'emulator-agent-123' },
}

async function signUp({ email, password }) {
  const res = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  })
  const body = await res.json()
  if (res.ok) return body.localId
  if (body.error?.message === 'EMAIL_EXISTS') {
    const login = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    })
    return (await login.json()).localId
  }
  throw new Error(`signUp ${email}: ${JSON.stringify(body)}`)
}

async function setAdmin(uid, email) {
  // `Bearer owner` bypasses security rules on the emulator only.
  const res = await fetch(`${FIRESTORE}/v1/projects/${PROJECT}/databases/(default)/documents/admins/${uid}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
    body: JSON.stringify({ fields: { email: { stringValue: email } } }),
  })
  if (!res.ok) throw new Error(`setAdmin: ${await res.text()}`)
}

const adminUid = await signUp(TEST_USERS.admin)
await setAdmin(adminUid, TEST_USERS.admin.email)
await signUp(TEST_USERS.agent)
console.log(`Seeded emulator: admin (${TEST_USERS.admin.email}) and non-admin (${TEST_USERS.agent.email}). See scripts/seed-emulator.mjs for passwords.`)
