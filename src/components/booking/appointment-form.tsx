"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function AppointmentForm() {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Info */}
          <div className="space-y-8">
            <div>
              <Badge className="bg-accent/10 text-accent mb-4">Reservation</Badge>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
                Book Your Consultation
              </h2>
              <p className="text-muted-foreground text-lg">
                Ready to transform your smile? Book an appointment online in under 2 minutes.
                Pick your service, choose a time that suits you, and we&apos;ll send a WhatsApp
                confirmation once confirmed.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  📞
                </div>
                <div>
                  <h4 className="font-bold text-primary">Direct Call</h4>
                  <p className="text-muted-foreground">+91 484 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  📍
                </div>
                <div>
                  <h4 className="font-bold text-primary">Clinic Location</h4>
                  <p className="text-muted-foreground">123 Palm Grove Road, Near River Bridge, Kerala</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  ⏰
                </div>
                <div>
                  <h4 className="font-bold text-primary">Working Hours</h4>
                  <p className="text-muted-foreground">All days: 10 AM – 1 PM · 2 PM – 3 PM · 5:30 PM – 9:30 PM</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-accent rounded-2xl text-white">
              <h3 className="font-heading text-2xl font-bold mb-2">Emergency Service</h3>
              <p className="opacity-90 mb-6">
                Need urgent dental attention? Call us directly for acute pain or trauma.
              </p>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-accent font-bold">
                Call Emergency Desk
              </Button>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col items-center justify-center bg-primary/5 rounded-3xl p-12 text-center space-y-6 border border-primary/10">
            <div className="text-6xl">🦷</div>
            <h3 className="font-heading text-3xl font-bold text-primary">
              Ready for a Healthier Smile?
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Book online in 2 minutes. Pick your service and a time that works for you.
              We&apos;ll confirm via WhatsApp.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold h-14 px-10 text-lg w-full max-w-xs" asChild>
              <Link href="/book">
                Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              No account needed · Pay in clinic · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
