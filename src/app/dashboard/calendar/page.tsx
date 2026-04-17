'use client'

import { useEffect, useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slotDate = (ts: string) => new Date(ts.slice(0, 19).replace(' ', 'T'))

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  rejected:  'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
}

interface Appointment {
  id: string
  patient_name: string
  slot_start: string
  status: string
  services?: { name: string }
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
    const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
    fetch(`/api/appointments?from=${start}&to=${end}`)
      .then(r => r.json())
      .then(data => { setAppointments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [currentMonth])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const byDay: Record<string, Appointment[]> = {}
  for (const appt of appointments) {
    const key = appt.slot_start.slice(0, 10)
    if (!byDay[key]) byDay[key] = []
    byDay[key].push(appt)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(m => subMonths(m, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(m => addMonths(m, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t">
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd')
          const dayAppts = byDay[key] || []
          const inMonth = isSameMonth(day, currentMonth)
          const today = isToday(day)

          return (
            <div key={key} className={`min-h-[110px] border-r border-b p-1.5 ${inMonth ? 'bg-white' : 'bg-gray-50'}`}>
              <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                today ? 'bg-teal-600 text-white' : inMonth ? 'text-gray-900' : 'text-gray-300'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayAppts.slice(0, 3).map(appt => (
                  <div
                    key={appt.id}
                    className={`text-xs rounded px-1 py-0.5 border truncate ${STATUS_COLORS[appt.status] || 'bg-gray-100'}`}
                    title={`${format(slotDate(appt.slot_start), 'h:mm a')} - ${appt.patient_name}`}
                  >
                    {format(slotDate(appt.slot_start), 'h:mm a')} {appt.patient_name}
                  </div>
                ))}
                {dayAppts.length > 3 && (
                  <div className="text-xs text-gray-400 px-1">+{dayAppts.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {Object.entries(STATUS_COLORS).map(([status, cls]) => (
          <span key={status} className={`px-2 py-0.5 rounded border text-xs font-medium ${cls}`}>
            {status}
          </span>
        ))}
      </div>
    </div>
  )
}
