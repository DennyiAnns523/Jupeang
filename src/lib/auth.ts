import 'server-only'
import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { db } from './db'
import { loginInput } from './validation'
import { clientIp, rateLimit } from './security'

export const BCRYPT_COST = 12

// Compared against when the email doesn't exist, so response time doesn't
// reveal which emails have accounts.
const DUMMY_HASH = '$2b$12$W6J1Sr3lt/1Kt1Rt2o3./eP43jeCSaeV/vXfam5tV8kBe5QXPhAYO'

class RateLimited extends CredentialsSignin {
  code = 'rate_limited'
}

export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  // Credentials sign-in requires JWT sessions. Roles are re-read from the
  // database on every protected request (see lib/session.ts), so the token
  // never grants access on its own.
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: '/auth/login', error: '/auth/login' },
  trustHost: true,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw, request) {
        const parsed = loginInput.safeParse(raw)
        if (!parsed.success) return null
        const { email, password } = parsed.data

        const ip = clientIp(request.headers)
        const allowed =
          (await rateLimit(`login:ip:${ip}`, 30, 15 * 60)) &&
          (await rateLimit(`login:email:${email}`, 8, 15 * 60))
        if (!allowed) throw new RateLimited()

        const user = await db.user.findUnique({ where: { email } })
        const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH)
        if (!user?.passwordHash || !ok) return null

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
    ...(googleEnabled ? [Google] : []),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      return token
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
})
