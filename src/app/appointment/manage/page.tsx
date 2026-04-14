'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { format, addDays } from 'date-fns'

const slotDate = (ts: string) => new Date(ts.slice(0, 19).replace(' ', 'T'))
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Appointment {
  id: string
  patient_name: string
  patient_phone: string
  slot_start: string
  status: string
  cancel_token: string
  reschedule_token: string
  services: { name: string; duration_minutes: number }
}

interface Slot { start: string; end: string; startISO: string; endISO: string }

function ManageContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const token = searchParams.get('token')
  const action = searchParams.get('action')

  const [appt, setAppt] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [doneMessage, setDoneMessage] = useState('')

  // Reschedule state
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [rescheduling, setRescheduling] = useState(false)

  useEffect(() => {
    if (!id || !token) { setError('Invalid link.'); setLoading(false); return }
    fetch(`/api/appointments/${id}?token=${token}`)
      .then(r => r.ok ? r.json() : Promise.reject('Invalid or expired link'))
      .then(data => { setAppt(data); setLoading(false) })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [id, token])

  useEffect(() => {
    if (!selectedDate || !appt) return
    setSlotsLoading(true)
    fetch(`/api/slots?date=${selectedDate}&serviceId=${appt.services.name}`)
      .then(r => r.json())
      .then(data => { setSlots(data); setSlotsLoading(false) })
  }, [selectedDate, appt])

  async function cancel() {
    if (!appt) return
    const res = await fetch(`/api/appointments/${appt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', cancel_token: appt.cancel_token }),
    })
    if (res.ok) {
      setDone(true)
      setDoneMessage('Your appointment has been cancelled. We hope to see you soon.')
    } else {
      const d = await res.json()
      toast.error(d.error || 'Could not cancel. Please call the clinic directly.')
    }
  }

  async function reschedule() {
    if (!appt || !selectedSlot) return
    setRescheduling(true)
    const res = await fetch(`/api/appointments/${appt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reschedule',
        reschedule_token: appt.reschedule_token,
        slot_start: selectedSlot.startISO,
        slot_end: selectedSlot.endISO,
      }),
    })
    if (res.ok) {
      setDone(true)
      setDoneMessage(`Your appointment has been rescheduled to ${format(slotDate(selectedSlot.startISO), 'EEEE, MMM d @ h:mm a')}. The clinic will confirm shortly.`)
    } else {
      toast.error('Could not reschedule. Please try again.')
    }
    setRescheduling(false)
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>
  if (!appt) return null

  if (done) return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Done!</h2>
        <p className="text-gray-500">{doneMessage}</p>
      </div>
    </div>
  )

  const isCancelled = appt.status === 'cancelled'
  const isCompleted = appt.status === 'completed'

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Manage Appointment</h1>
          <p className="text-gray-500">Dr. Anita Mankottill Dental Clinic</p>
        </div>

        <Card className="mb-4">
          <CardContent className="py-5">
            <div className="space-y-1">
              <div className="font-semibold text-lg">{appt.patient_name}</div>
              <div className="text-gray-600">{appt.services?.name}</div>
              <div className="text-gray-600">{format(slotDate(appt.slot_start), 'EEEE, MMMM d yyyy @ h:mm a')}</div>
              <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>{appt.status}</div>
            </div>
          </CardContent>
        </Card>

        {(isCancelled || isCompleted) ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              This appointment has already been {appt.status}.
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cancel */}
            {(action === 'cancel' || !action) && (
              <Card className="mb-4">
                <CardHeader><CardTitle className="text-base text-red-600">Cancel Appointment</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    This will cancel your appointment. You can rebook anytime.
                    Note: cancellations within 1 hour of the appointment are not allowed.
                  </p>
                  <Button variant="destructive" className="w-full" onClick={cancel}>
                    Cancel My Appointment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Reschedule */}
            {(action === 'reschedule' || !action) && (
              <Card>
                <CardHeader><CardTitle className="text-base">Reschedule Appointment</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="date">New Date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={format(new Date(), 'yyyy-MM-dd')}
                      max={format(addDays(new Date(), 60), 'yyyy-MM-dd')}
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                    />
                  </div>
                  {selectedDate && (
                    <div>
                      <Label>Available Slots</Label>
                      {slotsLoading ? (
                        <p className="text-sm text-gray-400 mt-2">Loading...</p>
                      ) : slots.length === 0 ? (
                        <p className="text-sm text-red-500 mt-2">No slots available. Try another date.</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {slots.map(slot => (
                            <button
                              key={slot.startISO}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-2 px-3 rounded border text-sm font-medium transition-colors ${
                                selectedSlot?.startISO === slot.startISO
                                  ? 'bg-teal-600 text-white border-teal-600'
                                  : 'hover:border-teal-400'
                              }`}
                            >
                              {slot.start}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    disabled={!selectedSlot || rescheduling}
                    onClick={reschedule}
                  >
                    {rescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ManagePage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <ManageContent />
    </Suspense>
  )
}
