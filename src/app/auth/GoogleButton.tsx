import { googleSignInAction } from './actions'

export default function GoogleButton({ callbackUrl }: { callbackUrl: string }) {
  return (
    <form action={googleSignInAction} className="pt-form" style={{ marginTop: 18 }}>
      <div className="pt-divider">or</div>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <button className="pt-button pt-button-ghost">Continue with Google</button>
    </form>
  )
}
