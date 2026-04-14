"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Calendar, UserCheck, Activity, Heart } from "lucide-react"

const steps = [
  {
    icon: Calendar,
    title: "Book Your Visit",
    label: "Step 01",
    short: "Quick online or phone booking.",
    detail: "Use our integrated booking form or call our clinic directly. We'll find a slot that fits your schedule perfectly."
  },
  {
    icon: UserCheck,
    title: "Expert Consultation",
    label: "Step 02",
    short: "Personalized smile assessment.",
    detail: "Meet Dr. Anita for a thorough exam. We discuss your goals and create a transparent treatment plan just for you."
  },
  {
    icon: Activity,
    title: "Gentle Treatment",
    label: "Step 03",
    short: "Modern, painless procedures.",
    detail: "Experience the latest in dental technology. Our focus is on making every procedure as comfortable as it is effective."
  },
  {
    icon: Heart,
    title: "Lasting Follow-up",
    label: "Step 04",
    short: "Ensuring long-term oral health.",
    detail: "We don't stop at treatment. We provide detailed aftercare and regular follow-ups to keep your smile radiant."
  }
]

export function PatientJourney() {
  return (
    <section id="journey" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <Badge className="bg-primary/10 text-primary mb-4">The Experience</Badge>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
              Your Path to a Brighter Smile
            </h2>
            <p className="text-muted-foreground text-lg">
              We've refined our process into four seamless steps designed to make 
              your dental experience in Kerala as relaxing as a holiday.
            </p>
          </div>
          <Button variant="outline" className="group border-accent text-accent hover:bg-accent hover:text-white font-bold h-12">
            <Play className="mr-2 h-4 w-4 group-hover:fill-current" /> Watch The Process
          </Button>
        </div>

        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted hidden md:block -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-background border-2 border-muted group-hover:border-accent transition-all rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl">
                  <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="h-8 w-8" />
                  </div>
                  
                  <Badge variant="outline" className="mb-4 font-bold tracking-widest text-[10px] uppercase">
                    {step.label}
                  </Badge>
                  
                  <h3 className="font-heading text-xl font-bold text-primary mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-6">
                    {step.short}
                  </p>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="link" className="text-accent p-0 h-auto font-bold h-10">
                        How it works →
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-bold font-heading text-primary leading-none">
                            {step.title} Details
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
