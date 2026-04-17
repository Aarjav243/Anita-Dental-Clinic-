'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const slotDate = (ts: string) => new Date(ts.slice(0, 19).replace(' ', 'T'))

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pending Review',  color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Confirmed ✓',     color: 'bg-green-100 text-green-800 border-green-200' },
  rejected:  { label: 'Rejected',        color: 'bg-red-100 text-red-800 border-red-200' },
  cancelled: { label: 'Cancelled',       color: 'bg-gray-100 text-gray-600 border-gray-200' },
  completed: { label: 'Completed',       color: 'bg-blue-100 text-blue-800 border-blue-200' },
}

interface Appointment {
  id: string
  patient_name: string
  slot_start: string
  slot_end: string
  status: string
  notes?: string
  rejection_reason?: string
  services: { name: string; duration_minutes: number }
}

export default function TrackPage() {
  const [phone, setPhone] = useState('')
  const [appointments, setAppointments] = useState<Appointment[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function track() {
    if (!phone.trim()) return
    setLoading(true)
    setError('')
    const res = await fetch(`/api/appointments/track?phone=${encodeURIComponent(phone.trim())}`)
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Something went wrong')
    } else {
      setAppointments(data)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Appointment</h1>
          <p className="text-gray-500 mt-2">Dr. Anita Mankottill Dental Clinic</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="phone">Enter your phone number</Label>
              <Input
                id="phone"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && track()}
              />
            </div>
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700"
              onClick={track}
              disabled={loading || !phone.trim()}
            >
              {loading ? 'Searching...' : 'Check Status'}
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
        </Card>

        {appointments !== null && (
          appointments.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-gray-500">
                No appointments found for this number.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments.map(appt => {
                const status = STATUS_CONFIG[appt.status] || { label: appt.status, color: 'bg-gray-100 text-gray-600 border-gray-200' }
                return (
                  <Card key={appt.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base">{appt.services?.name}</CardTitle>
                        <span className={`text-xs font-medium px-2 py-1 rounded border shrink-0 ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm text-gray-600">
                      <p>📅 {format(slotDate(appt.slot_start), 'EEEE, MMM d yyyy')}</p>
                      <p>🕐 {format(slotDate(appt.slot_start), 'h:mm a')} – {format(slotDate(appt.slot_end), 'h:mm a')}</p>
                      {appt.status === 'rejected' && appt.rejection_reason && (
                        <p className="text-red-600 mt-2">Reason: {appt.rejection_reason}</p>
                      )}
                      {appt.status === 'confirmed' && (
                        <p className="text-green-700 mt-2 font-medium">Your appointment is confirmed. See you soon!</p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
              <Button variant="outline" className="w-full" onClick={track}>
                Refresh Status
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  )
}
