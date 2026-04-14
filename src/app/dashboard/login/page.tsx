import { redirect } from 'next/navigation'

// Old login URL — redirects to /login (unauthenticated users never reach here; layout handles redirect)
export default function OldLoginPage() {
  redirect('/dashboard')
}
