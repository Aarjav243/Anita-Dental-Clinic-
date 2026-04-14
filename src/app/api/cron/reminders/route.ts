import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendReminder } from '@/lib/notifications'

// GET /api/cron/reminders — called by Vercel Cron every minute
export async function GET(req: NextRequest) {
  // Secure the cron endpoint
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const windowStart = new Date(now.getTime() + 29 * 60 * 1000) // 29 min from now
  const windowEnd = new Date(now.getTime() + 31 * 60 * 1000)   // 31 min from now

  const { data: appointments, error } = await supabaseAdmin
    .from('appointments')
    .select(`*, services(name)`)
    .eq('status', 'confirmed')
    .eq('reminder_sent', false)
    .gte('slot_start', windowStart.toISOString())
    .lte('slot_start', windowEnd.toISOString())

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = []

  for (const appt of appointments || []) {
    try {
      await sendReminder({
        patient_name: appt.patient_name,
        patient_phone: appt.patient_phone,
        service_name: appt.services.name,
        slot_start: appt.slot_start,
      })
      await supabaseAdmin
        .from('appointments')
        .update({ reminder_sent: true })
        .eq('id', appt.id)
      results.push({ id: appt.id, status: 'sent' })
    } catch (e) {
      results.push({ id: appt.id, status: 'failed', error: String(e) })
    }
  }

  return NextResponse.json({ processed: results.length, results })
}
