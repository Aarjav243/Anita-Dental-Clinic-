import { format } from 'date-fns'

const slotDate = (ts: string) => new Date(ts.slice(0, 19).replace(' ', 'T'))

const PHONE_NUMBER_ID = process.env.META_WHATSAPP_PHONE_NUMBER_ID!
const TOKEN = process.env.META_WHATSAPP_TOKEN!
const ASSISTANT = process.env.ASSISTANT_WHATSAPP!

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('91') && digits.length === 12) return digits
  if (digits.length === 10) return `91${digits}`
  return digits
}

async function sendTemplate(to: string, template: string, params: string[]) {
  const res = await fetch(
    `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formatPhone(to),
        type: 'template',
        template: {
          name: template,
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: params.map((p) => ({ type: 'text', text: p })),
            },
          ],
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Meta WhatsApp error: ${JSON.stringify(err)}`)
  }

  return res.json()
}

export async function notifyAssistantNewBooking(appointment: {
  id: string
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
}) {
  const dateTime = format(slotDate(appointment.slot_start), 'EEEE, MMM d yyyy @ h:mm a')
  await sendTemplate(ASSISTANT, 'new_booking_alert', [
    appointment.patient_name,
    appointment.patient_phone,
    appointment.service_name,
    dateTime,
  ])
}

export async function notifyPatientConfirmed(appointment: {
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
  cancel_token: string
  reschedule_token: string
}) {
  const dateTime = format(slotDate(appointment.slot_start), 'EEEE, MMM d yyyy @ h:mm a')
  const baseUrl = process.env.NEXTAUTH_URL
  await sendTemplate(appointment.patient_phone, 'appointment_confirmed', [
    appointment.patient_name,
    dateTime,
    appointment.service_name,
    `${baseUrl}/appointment/manage?id=${appointment.cancel_token}&token=${appointment.cancel_token}&action=cancel`,
    `${baseUrl}/appointment/manage?id=${appointment.reschedule_token}&token=${appointment.reschedule_token}&action=reschedule`,
  ])
}

export async function notifyPatientRejected(appointment: {
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
  rejection_reason?: string
}) {
  const dateTime = format(slotDate(appointment.slot_start), 'EEEE, MMM d yyyy @ h:mm a')
  await sendTemplate(appointment.patient_phone, 'appointment_rejected', [
    appointment.patient_name,
    appointment.service_name,
    dateTime,
    appointment.rejection_reason || 'No reason provided',
    `${process.env.NEXTAUTH_URL}/book`,
  ])
}

export async function notifyPatientCancelled(appointment: {
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
}) {
  const dateTime = format(slotDate(appointment.slot_start), 'EEEE, MMM d yyyy @ h:mm a')
  await sendTemplate(appointment.patient_phone, 'appointment_cancelled', [
    appointment.patient_name,
    appointment.service_name,
    dateTime,
    `${process.env.NEXTAUTH_URL}/book`,
  ])
}

export async function notifyAssistantCancelled(appointment: {
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
}) {
  const dateTime = format(slotDate(appointment.slot_start), 'EEEE, MMM d yyyy @ h:mm a')
  await sendTemplate(ASSISTANT, 'appointment_cancelled', [
    appointment.patient_name,
    appointment.service_name,
    dateTime,
    `${process.env.NEXTAUTH_URL}/book`,
  ])
}

export async function sendReminder(appointment: {
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
}) {
  const time = format(slotDate(appointment.slot_start), 'h:mm a')
  await sendTemplate(appointment.patient_phone, 'appointment_reminder', [
    appointment.patient_name,
    appointment.service_name,
    time,
  ])
}
