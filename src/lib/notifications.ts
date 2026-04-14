import { format } from 'date-fns'

// Supabase returns timestamptz as "2026-04-15 10:00:00+00".
// Stripping the offset and parsing as a naive local Date avoids IST/UTC shift on the server.
const slotDate = (ts: string) => new Date(ts.slice(0, 19).replace(' ', 'T'))

const PHONE_NUMBER_ID = process.env.META_WHATSAPP_PHONE_NUMBER_ID!
const TOKEN = process.env.META_WHATSAPP_TOKEN!
const ASSISTANT = process.env.ASSISTANT_WHATSAPP! // e.g. 918788117178

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('91') && digits.length === 12) return digits
  if (digits.length === 10) return `91${digits}`
  return digits
}

async function sendWhatsApp(to: string, body: string) {
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
        type: 'text',
        text: { body },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Meta WhatsApp error: ${JSON.stringify(err)}`)
  }

  return res.json()
}

// Notify assistant of new booking request
export async function notifyAssistantNewBooking(appointment: {
  id: string
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
}) {
  const dateTime = format(slotDate(appointment.slot_start), 'EEEE, MMM d yyyy @ h:mm a')
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard/requests`

  await sendWhatsApp(
    ASSISTANT,
    `📋 *New Appointment Request*\n\nPatient: ${appointment.patient_name}\nPhone: ${appointment.patient_phone}\nService: ${appointment.service_name}\nRequested: ${dateTime}\n\nAccept or reject at:\n${dashboardUrl}`
  )
}

// Notify patient of confirmation
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

  await sendWhatsApp(
    appointment.patient_phone,
    `✅ *Appointment Confirmed!*\n\nHello ${appointment.patient_name},\n\nYour appointment at Dr. Anita Mankottill Dental Clinic is confirmed.\n\n📅 ${dateTime}\n🦷 ${appointment.service_name}\n\nTo cancel: ${baseUrl}/appointment/manage?id=${appointment.cancel_token}&token=${appointment.cancel_token}&action=cancel\nTo reschedule: ${baseUrl}/appointment/manage?id=${appointment.reschedule_token}&token=${appointment.reschedule_token}&action=reschedule\n\nSee you soon!`
  )
}

// Notify patient of rejection
export async function notifyPatientRejected(appointment: {
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
  rejection_reason?: string
}) {
  const dateTime = format(slotDate(appointment.slot_start), 'EEEE, MMM d yyyy @ h:mm a')
  const bookUrl = `${process.env.NEXTAUTH_URL}/book`

  await sendWhatsApp(
    appointment.patient_phone,
    `❌ *Appointment Update*\n\nHello ${appointment.patient_name},\n\nUnfortunately your request for ${appointment.service_name} on ${dateTime} could not be accommodated.${appointment.rejection_reason ? `\n\nReason: ${appointment.rejection_reason}` : ''}\n\nPlease book a new slot at:\n${bookUrl}\n\nWe apologise for the inconvenience.`
  )
}

// Notify patient of cancellation
export async function notifyPatientCancelled(appointment: {
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
}) {
  const dateTime = format(slotDate(appointment.slot_start), 'EEEE, MMM d yyyy @ h:mm a')

  await sendWhatsApp(
    appointment.patient_phone,
    `🗓️ *Appointment Cancelled*\n\nHello ${appointment.patient_name},\n\nYour ${appointment.service_name} appointment on ${dateTime} has been cancelled.\n\nTo rebook, visit: ${process.env.NEXTAUTH_URL}/book`
  )
}

// Notify assistant when patient cancels
export async function notifyAssistantCancelled(appointment: {
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
}) {
  const dateTime = format(slotDate(appointment.slot_start), 'EEEE, MMM d yyyy @ h:mm a')

  await sendWhatsApp(
    ASSISTANT,
    `❌ *Appointment Cancelled by Patient*\n\nPatient: ${appointment.patient_name}\nPhone: ${appointment.patient_phone}\nService: ${appointment.service_name}\nWas: ${dateTime}\n\nSlot is now free.`
  )
}

// 30-min reminder to patient
export async function sendReminder(appointment: {
  patient_name: string
  patient_phone: string
  service_name: string
  slot_start: string
}) {
  const time = format(slotDate(appointment.slot_start), 'h:mm a')

  await sendWhatsApp(
    appointment.patient_phone,
    `⏰ *Appointment Reminder*\n\nHello ${appointment.patient_name},\n\nYour ${appointment.service_name} appointment is in *30 minutes* at ${time}.\n\nDr. Anita Mankottill Dental Clinic\n\nSee you soon! 😊`
  )
}
