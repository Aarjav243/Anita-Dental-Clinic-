'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'

const slotDate = (ts: string) => new Date(ts.slice(0, 19).replace(' ', 'T'))
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface Appointment {
  id: string
  patient_name: string
  patient_phone: string
  slot_start: string
  notes?: string
  services: { name: string }
}

export default function RequestsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/appointments?status=pending')
    const data = await res.json()
    setAppointments(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function confirm(id: string) {
    setActionLoading(id)
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'confirm' }),
    })
    if (res.ok) {
      toast.success('Appointment confirmed — patient notified via WhatsApp')
      load()
    } else {
      toast.error('Failed to confirm')
    }
    setActionLoading(null)
  }

  async function reject(id: string) {
    setActionLoading(id)
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', rejection_reason: rejectReason }),
    })
    if (res.ok) {
      toast.success('Appointment rejected — patient notified via WhatsApp')
      setRejectingId(null)
      setRejectReason('')
      load()
    } else {
      toast.error('Failed to reject')
    }
    setActionLoading(null)
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Requests</h2>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No pending requests. You're all caught up!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <Card key={appt.id}>
              <CardContent className="py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-lg">{appt.patient_name}</div>
                    <div className="text-sm text-gray-500">{appt.patient_phone}</div>
                    <div className="mt-1 text-sm font-medium">{appt.services?.name}</div>
                    <div className="text-sm text-gray-600">
                      {format(slotDate(appt.slot_start), 'EEEE, MMM d @ h:mm a')}
                    </div>
                    {appt.notes && (
                      <div className="mt-2 text-sm text-gray-500 italic">"{appt.notes}"</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => confirm(appt.id)}
                      disabled={!!actionLoading}
                    >
                      {actionLoading === appt.id ? '...' : 'Accept'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setRejectingId(appt.id)}
                      disabled={!!actionLoading}
                    >
                      Reject
                    </Button>
                  </div>
                </div>

                {rejectingId === appt.id && (
                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder="Reason for rejection (optional — sent to patient)"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => reject(appt.id)}
                        disabled={!!actionLoading}
                      >
                        Confirm Rejection
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setRejectingId(null); setRejectReason('') }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
