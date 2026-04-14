'use client'

import { useEffect, useState } from 'react'
import { format, addDays } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface Service { id: string; name: string; duration_minutes: number; description: string }
interface Slot { start: string; end: string; startISO: string; endISO: string }

type Step = 'service' | 'datetime' | 'details' | 'success'

export default function BookPage() {
  const [step, setStep] = useState<Step>('service')
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(setServices)
  }, [])

  useEffect(() => {
    if (!selectedDate || !selectedService) return
    setSlotsLoading(true)
    setSlots([])
    setSelectedSlot(null)
    fetch(`/api/slots?date=${selectedDate}&serviceId=${selectedService.id}`)
      .then(r => r.json())
      .then(data => { setSlots(data); setSlotsLoading(false) })
  }, [selectedDate, selectedService])

  async function submit() {
    if (!selectedSlot || !selectedService || !name || !phone) return
    setSubmitting(true)
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: name,
        patient_phone: phone,
        service_id: selectedService.id,
        slot_start: selectedSlot.startISO,
        slot_end: selectedSlot.endISO,
        notes,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setStep('success')
    } else {
      toast.error(data.error || 'Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  const minDate = format(new Date(), 'yyyy-MM-dd')
  const maxDate = format(addDays(new Date(), 60), 'yyyy-MM-dd')

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-500 mt-2">Dr. Anita Mankottill Dental Clinic</p>
        </div>

        {/* Progress */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {(['service', 'datetime', 'details'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s ? 'bg-teal-600 text-white' :
                  ['service', 'datetime', 'details'].indexOf(step) > i ? 'bg-teal-200 text-teal-800' :
                  'bg-gray-200 text-gray-500'
                }`}>{i + 1}</div>
                {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Service */}
        {step === 'service' && (
          <Card>
            <CardHeader><CardTitle>Select a Service</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep('datetime') }}
                  className="w-full text-left p-4 rounded-lg border hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.duration_minutes} minutes · {s.description}</div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Date & Slot */}
        {step === 'datetime' && selectedService && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Date & Time</CardTitle>
              <p className="text-sm text-gray-500">{selectedService.name}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>

              {selectedDate && (
                <div>
                  <Label>Available Slots</Label>
                  {slotsLoading ? (
                    <p className="text-sm text-gray-500 mt-2">Loading slots...</p>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-red-500 mt-2">No slots available on this date. Please try another day.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {slots.map(slot => (
                        <button
                          key={slot.startISO}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                            selectedSlot?.startISO === slot.startISO
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'hover:border-teal-400 hover:bg-teal-50'
                          }`}
                        >
                          {slot.start}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('service')}>Back</Button>
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={!selectedSlot}
                  onClick={() => setStep('details')}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Patient Details */}
        {step === 'details' && selectedSlot && selectedService && (
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
              <div className="text-sm text-gray-500">
                {selectedService.name} · {format(new Date(selectedDate), 'EEE, MMM d')} at {selectedSlot.start}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">WhatsApp / Phone Number *</Label>
                <Input id="phone" placeholder="e.g. 9876543210" value={phone} onChange={e => setPhone(e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">We'll send your confirmation to this number</p>
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any concerns or special requests?"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('datetime')}>Back</Button>
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={!name || !phone || submitting}
                  onClick={submit}
                >
                  {submitting ? 'Submitting...' : 'Request Appointment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success */}
        {step === 'success' && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
              <p className="text-gray-500 mb-4">
                Thank you, {name}. Your appointment request has been sent to the clinic.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                You'll receive a WhatsApp confirmation on <strong>{phone}</strong> once the clinic confirms your booking.
              </p>
              <Button onClick={() => { setStep('service'); setSelectedService(null); setSelectedSlot(null); setSelectedDate(''); setName(''); setPhone(''); setNotes('') }}>
                Book Another Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
