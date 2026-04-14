import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'
import {
  notifyPatientConfirmed,
  notifyPatientRejected,
  notifyPatientCancelled,
  notifyAssistantCancelled,
} from '@/lib/notifications'

async function getAppointment(id: string) {
  const { data } = await supabaseAdmin
    .from('appointments')
    .select(`*, services(name)`)
    .eq('id', id)
    .single()
  return data
}

// PATCH /api/appointments/[id] — confirm, reject, cancel, complete, reschedule
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { action, rejection_reason, slot_start, slot_end, cancel_token, reschedule_token } = body

  // Patient cancel/reschedule — token-based, no auth needed
  if (action === 'cancel' && cancel_token) {
    const appt = await supabaseAdmin
      .from('appointments')
      .select(`*, services(name)`)
      .eq('id', id)
      .eq('cancel_token', cancel_token)
      .single()

    if (!appt.data) return NextResponse.json({ error: 'Invalid token' }, { status: 403 })

    // Block cancel within 1 hour of appointment
    const slotTime = new Date(appt.data.slot_start).getTime()
    if (slotTime - Date.now() < 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Cannot cancel within 1 hour of appointment' }, { status: 400 })
    }

    await supabaseAdmin.from('appointments').update({ status: 'cancelled' }).eq('id', id)

    try {
      await notifyPatientCancelled({
        patient_name: appt.data.patient_name,
        patient_phone: appt.data.patient_phone,
        service_name: appt.data.services.name,
        slot_start: appt.data.slot_start,
      })
      await notifyAssistantCancelled({
        patient_name: appt.data.patient_name,
        patient_phone: appt.data.patient_phone,
        service_name: appt.data.services.name,
        slot_start: appt.data.slot_start,
      })
    } catch (e) {
      console.error('Notify failed:', e)
    }

    return NextResponse.json({ success: true })
  }

  // Patient reschedule — token-based
  if (action === 'reschedule' && reschedule_token) {
    const appt = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('id', id)
      .eq('reschedule_token', reschedule_token)
      .single()

    if (!appt.data) return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
    if (!slot_start || !slot_end) return NextResponse.json({ error: 'New slot required' }, { status: 400 })

    await supabaseAdmin
      .from('appointments')
      .update({ slot_start, slot_end, status: 'pending', reminder_sent: false })
      .eq('id', id)

    return NextResponse.json({ success: true })
  }

  // Assistant actions — require auth
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const appt = await getAppointment(id)
  if (!appt) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (action === 'confirm') {
    await supabaseAdmin.from('appointments').update({ status: 'confirmed' }).eq('id', id)
    try {
      await notifyPatientConfirmed({
        patient_name: appt.patient_name,
        patient_phone: appt.patient_phone,
        service_name: appt.services.name,
        slot_start: appt.slot_start,
        cancel_token: appt.cancel_token,
        reschedule_token: appt.reschedule_token,
      })
    } catch (e) {
      console.error('Notify failed:', e)
    }
    return NextResponse.json({ success: true })
  }

  if (action === 'reject') {
    await supabaseAdmin
      .from('appointments')
      .update({ status: 'rejected', rejection_reason })
      .eq('id', id)
    try {
      await notifyPatientRejected({
        patient_name: appt.patient_name,
        patient_phone: appt.patient_phone,
        service_name: appt.services.name,
        slot_start: appt.slot_start,
        rejection_reason,
      })
    } catch (e) {
      console.error('Notify failed:', e)
    }
    return NextResponse.json({ success: true })
  }

  if (action === 'complete') {
    await supabaseAdmin.from('appointments').update({ status: 'completed' }).eq('id', id)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// GET /api/appointments/[id] — get single appointment (for manage page)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  const { data } = await supabaseAdmin
    .from('appointments')
    .select(`*, services(name, duration_minutes)`)
    .eq('id', id)
    .single()

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Verify token matches either cancel or reschedule token
  if (token !== data.cancel_token && token !== data.reschedule_token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }

  return NextResponse.json(data)
}
