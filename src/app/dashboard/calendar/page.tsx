import { supabaseAdmin } from '@/lib/supabase'
import { format, startOfWeek, addDays } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'

const slotDate = (ts: string) => new Date(ts.slice(0, 19).replace(' ', 'T'))

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
}

export default async function CalendarPage() {
  // Build a 7-day window starting from today
  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i))

  const weekStart = format(weekDays[0], 'yyyy-MM-dd')
  const weekEnd = format(weekDays[6], 'yyyy-MM-dd')

  const { data: appointments } = await supabaseAdmin
    .from('appointments')
    .select(`*, services(name, duration_minutes)`)
    .gte('slot_start', `${weekStart}T00:00:00`)
    .lte('slot_start', `${weekEnd}T23:59:59`)
    .not('status', 'in', '("rejected","cancelled")')
    .order('slot_start')

  // Group by date
  const byDay: Record<string, typeof appointments> = {}
  for (const day of weekDays) {
    byDay[format(day, 'yyyy-MM-dd')] = []
  }
  for (const appt of appointments || []) {
    const key = appt.slot_start.slice(0, 10)
    if (byDay[key]) byDay[key].push(appt)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">7-Day View</h2>
        <p className="text-gray-500">{format(today, 'MMMM d')} – {format(weekDays[6], 'MMMM d, yyyy')}</p>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const dayAppts = byDay[key] || []
          const isToday = key === format(today, 'yyyy-MM-dd')

          return (
            <div key={key} className="min-h-[300px]">
              {/* Day header */}
              <div className={`text-center mb-2 py-1 rounded-lg ${isToday ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                <div className="text-lg font-bold">{format(day, 'd')}</div>
              </div>

              {/* Appointments */}
              <div className="space-y-1.5">
                {dayAppts.length === 0 ? (
                  <div className="text-center text-xs text-gray-300 pt-4">—</div>
                ) : (
                  dayAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className={`rounded border px-2 py-1.5 text-xs ${STATUS_COLORS[appt.status] || 'bg-gray-100'}`}
                    >
                      <div className="font-semibold">{format(slotDate(appt.slot_start), 'h:mm a')}</div>
                      <div className="truncate font-medium">{appt.patient_name}</div>
                      <div className="truncate opacity-75">{appt.services?.name}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-3">
        {Object.entries(STATUS_COLORS).map(([status, cls]) => (
          <span key={status} className={`px-2 py-0.5 rounded border text-xs font-medium ${cls}`}>
            {status}
          </span>
        ))}
      </div>
    </div>
  )
}
