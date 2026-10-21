// Usage: npm run make-admin -- someone@example.com
// Promotes an existing account to ADMIN. Run it against the target database
// (DATABASE_URL from .env.local / .env). The person must have signed up first.
import { config } from 'dotenv'
import pg from 'pg'

config({ path: '.env.local' })
config()

const email = process.argv[2]?.trim().toLowerCase()
if (!email) {
  console.error('Usage: npm run make-admin -- <email>')
  process.exit(1)
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
const { rowCount } = await client.query(`UPDATE "User" SET role = 'ADMIN' WHERE email = $1`, [email])
await client.end()

if (!rowCount) {
  console.error(`No account found for ${email}. Sign up on the site first.`)
  process.exit(1)
}
console.log(`${email} is now an admin.`)
