import { requireUser } from '@/lib/session'
import { PasswordForm, ProfileForm } from './SettingsForms'

export const metadata = { title: 'Settings — Üli' }

export default async function SettingsPage() {
  const user = await requireUser('/account/settings')
  return (
    <>
      <section className="pt-section" style={{ maxWidth: 520 }}>
        <h2 className="pt-subtitle">Your details</h2>
        <p className="pt-muted">Signed in as {user.email}</p>
        <ProfileForm name={user.name ?? ''} phone={user.phone ?? ''} />
      </section>
      <section className="pt-section" style={{ maxWidth: 520 }}>
        <h2 className="pt-subtitle">{user.passwordHash ? 'Change password' : 'Set a password'}</h2>
        <PasswordForm hasPassword={Boolean(user.passwordHash)} />
      </section>
    </>
  )
}
