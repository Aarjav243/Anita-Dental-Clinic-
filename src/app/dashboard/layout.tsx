import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-sm">
        <div className="p-6 border-b">
          <h1 className="font-bold text-lg text-gray-900">Clinic Dashboard</h1>
          <p className="text-sm text-gray-500">Dr. Anita Mankottill</p>
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
            📅 Today
          </Link>
          <Link href="/dashboard/requests" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
            📋 Pending Requests
          </Link>
          <Link href="/dashboard/calendar" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
            🗓️ Calendar
          </Link>
          <Link href="/dashboard/availability" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
            🚫 Block Dates
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <p className="text-xs text-gray-500 mb-2">{session.user?.email}</p>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }) }}>
            <button type="submit" className="text-sm text-red-500 hover:text-red-700">
              Sign out
            </button>
          </form>
        </div>
      </div>
      {/* Main content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  )
}
