import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone')
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })

  const digits = phone.replace(/\D/g, '')
  const normalized = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .select(`*, services(name, duration_minutes)`)
    .or(`patient_phone.eq.${normalized},patient_phone.eq.91${normalized}`)
    .order('slot_start', { ascending: false })
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
