import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { notifyAssistantNewBooking } from '@/lib/notifications'
import { auth } from '@/lib/auth'

// POST /api/appointments — patient books
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { patient_name, patient_phone, service_id, slot_start, slot_end, notes } = body

  if (!patient_name || !patient_phone || !service_id || !slot_start || !slot_end) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Double-check slot is still available
  const { data: conflict } = await supabaseAdmin
    .from('appointments')
    .select('id')
    .lte('slot_start', slot_end)
    .gte('slot_end', slot_start)
    .in('status', ['pending', 'confirmed'])
    .limit(1)

  if (conflict && conflict.length > 0) {
    return NextResponse.json({ error: 'This slot was just taken. Please choose another.' }, { status: 409 })
  }

  const { data: appointment, error } = await supabaseAdmin
    .from('appointments')
    .insert({ patient_name, patient_phone, service_id, slot_start, slot_end, notes })
    .select(`*, services(name)`)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify assistant via WhatsApp
  try {
    await notifyAssistantNewBooking({
      id: appointment.id,
      patient_name: appointment.patient_name,
      patient_phone: appointment.patient_phone,
      service_name: appointment.services.name,
      slot_start: appointment.slot_start,
    })
  } catch (e) {
    console.error('WhatsApp notify failed:', e)
  }

  return NextResponse.json({ success: true, id: appointment.id }, { status: 201 })
}

// GET /api/appointments — assistant dashboard (protected)
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const date = searchParams.get('date')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let query = supabaseAdmin
    .from('appointments')
    .select(`*, services(name, duration_minutes)`)
    .order('slot_start', { ascending: true })

  if (status) query = query.eq('status', status)
  if (date) {
    query = query
      .gte('slot_start', `${date}T00:00:00.000Z`)
      .lte('slot_start', `${date}T23:59:59.999Z`)
  }
  if (from) query = query.gte('slot_start', `${from}T00:00:00.000Z`)
  if (to) query = query.lte('slot_start', `${to}T23:59:59.999Z`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
