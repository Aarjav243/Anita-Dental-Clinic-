"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const stats = [
  { label: "Happy Patients", value: 15000, suffix: "+" },
  { label: "Years Excellence", value: 20, suffix: "+" },
  { label: "Dental Services", value: 50, suffix: "+" },
  { label: "Clinical Awards", value: 12, suffix: "" },
]

export function AboutSection() {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="about" className="py-24 bg-surface" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-2xl border-4 border-accent shadow-2xl">
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage src="/dr-anita.jpg" alt="Dr. Anita Mankottill" className="object-cover" />
                <AvatarFallback className="bg-primary-light text-primary font-heading text-4xl">
                  AM
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Kerala Inspired Floating Label */}
            <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-white p-6 rounded-xl shadow-xl border-l-4 border-accent max-w-xs hidden sm:block">
              <p className="font-heading italic text-lg text-primary">
                "Treating every patient like family with world-class expertise."
              </p>
            </div>
          </motion.div>

          <div className="space-y-8">
            <div>
              <Badge className="bg-accent/10 text-accent mb-4">The Doctor Behind the Smiles</Badge>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                Dr. Anita Mankottill
              </h2>
              <p className="text-accent font-bold uppercase tracking-widest text-sm">
                BDS, MDS (Prosthodontics) • Senior Consultant
              </p>
            </div>

            <Tabs defaultValue="background" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger value="background">Background</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
              </TabsList>
              <div className="mt-6 min-h-[220px]">
                <TabsContent value="background" className="animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    With over two decades of experience, Dr. Anita Mankottill has been a pillar 
                    of the dental community in Kerala. Her journey began with a passion for 
                    restoring not just smiles, but lives. She has served as a senior consultant 
                    in several multi-specialty hospitals before founding her private practice.
                  </p>
                </TabsContent>
                <TabsContent value="credentials" className="animate-in fade-in slide-in-from-bottom-2">
                  <ul className="space-y-4">
                    {[
                      "BDS and MDS from premier dental institutions in India.",
                      "Specialized in Prosthodontics and Crown & Bridge.",
                      "Member of Indian Dental Association (IDA).",
                      "Registered with the Kerala Dental Council.",
                      "Certified in Advanced Dental Implant Management."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="philosophy" className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                    <p className="text-primary italic text-lg leading-relaxed">
                      "I believe that modern dentistry should be as comfortable as it is effective. 
                      My goal is to provide a stress-free environment where clinical excellence 
                      meets genuine Kerala hospitality. We don't just treat teeth; we care for people."
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="font-heading text-3xl font-bold text-primary flex items-center justify-center md:justify-start">
                    <Counter value={stat.value} trigger={isInView} />
                    <span>{stat.suffix}</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Counter({ value, trigger }: { value: number; trigger: boolean }) {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!trigger) return

    let start = 0
    const end = value
    const duration = 2000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value, trigger])

  return <span>{count.toLocaleString()}</span>
}
