import { supabaseAdmin } from '@/lib/supabase'
import { format } from 'date-fns'

const slotDate = (ts: string) => new Date(ts.slice(0, 19).replace(' ', 'T'))
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
}

export default async function DashboardPage() {
  const today = format(new Date(), 'yyyy-MM-dd')

  const { data: appointments } = await supabaseAdmin
    .from('appointments')
    .select(`*, services(name, duration_minutes)`)
    .gte('slot_start', `${today}T00:00:00.000Z`)
    .lte('slot_start', `${today}T23:59:59.999Z`)
    .order('slot_start')

  const { data: pending } = await supabaseAdmin
    .from('appointments')
    .select('id')
    .eq('status', 'pending')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Today</h2>
          <p className="text-gray-500">{format(new Date(), 'EEEE, MMMM d yyyy')}</p>
        </div>
        {(pending?.length ?? 0) > 0 && (
          <a href="/dashboard/requests" className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600">
            {pending?.length} pending request{pending?.length !== 1 ? 's' : ''}
          </a>
        )}
      </div>

      {!appointments || appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No appointments scheduled for today.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <Card key={appt.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="text-center w-16">
                    <div className="font-bold text-lg">{format(slotDate(appt.slot_start), 'h:mm')}</div>
                    <div className="text-xs text-gray-500">{format(slotDate(appt.slot_start), 'a')}</div>
                  </div>
                  <div>
                    <div className="font-medium">{appt.patient_name}</div>
                    <div className="text-sm text-gray-500">{appt.services?.name} · {appt.patient_phone}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[appt.status]}`}>
                  {appt.status}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
