import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'

// GET — list all overrides
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('availability_overrides')
    .select('*')
    .order('date')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — block or unblock a date (assistant only)
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { date, is_available, reason } = await req.json()

  const { error } = await supabaseAdmin
    .from('availability_overrides')
    .upsert({ date, is_available, reason }, { onConflict: 'date' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE — remove override (restore normal availability)
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { date } = await req.json()
  await supabaseAdmin.from('availability_overrides').delete().eq('date', date)
  return NextResponse.json({ success: true })
}
