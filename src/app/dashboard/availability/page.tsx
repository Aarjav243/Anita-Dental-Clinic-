'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Override {
  id: string
  date: string
  is_available: boolean
  reason?: string
}

export default function AvailabilityPage() {
  const [overrides, setOverrides] = useState<Override[]>([])
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch('/api/availability')
    const data = await res.json()
    setOverrides(data)
  }

  useEffect(() => { load() }, [])

  async function blockDate() {
    if (!date) return
    setLoading(true)
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, is_available: false, reason }),
    })
    if (res.ok) {
      toast.success(`${date} blocked — no bookings will be accepted`)
      setDate('')
      setReason('')
      load()
    } else {
      toast.error('Failed to block date')
    }
    setLoading(false)
  }

  async function unblock(dateStr: string) {
    await fetch('/api/availability', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr }),
    })
    toast.success('Date unblocked')
    load()
  }

  const blocked = overrides.filter(o => !o.is_available)

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Block Dates</h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Block a Date</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input
              id="reason"
              placeholder="e.g. Public holiday, Doctor unavailable"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <Button onClick={blockDate} disabled={!date || loading}>
            {loading ? 'Blocking...' : 'Block This Date'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Currently Blocked Dates</CardTitle>
        </CardHeader>
        <CardContent>
          {blocked.length === 0 ? (
            <p className="text-sm text-gray-500">No dates are blocked.</p>
          ) : (
            <div className="space-y-2">
              {blocked.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <span className="font-medium">{format(new Date(o.date + 'T12:00:00'), 'EEEE, MMM d yyyy')}</span>
                    {o.reason && <span className="text-sm text-gray-500 ml-2">— {o.reason}</span>}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => unblock(o.date)}>
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
