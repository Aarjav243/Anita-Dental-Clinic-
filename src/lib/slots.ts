import { supabaseAdmin } from './supabase'
import { format, parseISO } from 'date-fns'

// Doctor schedule
const SCHEDULE = [
  { start: '10:00', end: '13:00' }, // Morning: 10AM - 1PM (lunch break 1-2PM)
  { start: '14:00', end: '15:00' }, // After lunch: 2PM - 3PM
  { start: '17:30', end: '21:30' }, // Evening: 5:30PM - 9:30PM
]

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export interface TimeSlot {
  start: string // "10:00"
  end: string   // "10:45"
  startISO: string
  endISO: string
  available: boolean
}

export async function getAvailableSlots(date: string, serviceId: string): Promise<TimeSlot[]> {
  // Check if date is blocked
  const { data: override } = await supabaseAdmin
    .from('availability_overrides')
    .select('is_available')
    .eq('date', date)
    .single()

  if (override && !override.is_available) return []

  // Get service duration
  const { data: service } = await supabaseAdmin
    .from('services')
    .select('duration_minutes, buffer_minutes')
    .eq('id', serviceId)
    .single()

  if (!service) return []

  const totalDuration = service.duration_minutes + service.buffer_minutes

  // Get existing confirmed appointments for the day
  const dayStart = `${date}T00:00:00.000Z`
  const dayEnd = `${date}T23:59:59.999Z`

  const { data: existing } = await supabaseAdmin
    .from('appointments')
    .select('slot_start, slot_end')
    .gte('slot_start', dayStart)
    .lte('slot_start', dayEnd)
    .in('status', ['pending', 'confirmed'])

  // Extract HH:mm directly from the ISO string to avoid local timezone shift.
  // Supabase returns "2026-04-15 10:00:00+00" — slice(11,16) = "10:00" regardless of system TZ.
  const bookedSlots = (existing || []).map(a => ({
    start: timeToMinutes(a.slot_start.slice(11, 16)),
    end: timeToMinutes(a.slot_end.slice(11, 16)),
  }))

  const slots: TimeSlot[] = []
  const now = new Date()
  const isToday = date === format(now, 'yyyy-MM-dd')
  const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() + 30 : 0

  for (const session of SCHEDULE) {
    const sessionStart = timeToMinutes(session.start)
    const sessionEnd = timeToMinutes(session.end)
    let cursor = sessionStart

    while (cursor + totalDuration <= sessionEnd) {
      const slotEnd = cursor + totalDuration

      // Skip past slots for today
      if (isToday && cursor < currentMinutes) {
        cursor += 15
        continue
      }

      // Check if slot conflicts with any existing booking
      const hasConflict = bookedSlots.some(b => {
        return cursor < b.end && slotEnd > b.start
      })

      const startTime = minutesToTime(cursor)
      const endTime = minutesToTime(cursor + service.duration_minutes)
      const startISO = `${date}T${startTime.padStart(5, '0')}:00`
      const endISO = `${date}T${endTime.padStart(5, '0')}:00`

      slots.push({
        start: startTime,
        end: endTime,
        startISO,
        endISO,
        available: !hasConflict,
      })

      cursor += totalDuration
    }
  }

  return slots.filter(s => s.available)
}
