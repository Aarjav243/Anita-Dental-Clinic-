"use client"

import * as React from "react"
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Stethoscope, Sparkles, Ruler, Settings, Baby, ShieldAlert, ArrowRight, Clock, Info } from "lucide-react"

const services = [
  {
    icon: Stethoscope,
    title: "General Dentistry",
    duration: "45 min",
    badge: "Routine Care",
    shortDesc: "Routine checkups, cleanings, and preventative care.",
    fullDesc: "Our general dentistry services are the foundation of healthy smiles in Kerala. We focus on preventative care and early detection to ensure your oral health remains peak.",
    whatToExpect: "Comprehensive exam, professional cleaning, oral cancer screening, and dental X-rays if needed.",
    prepTips: "Bring your medical history and a list of any medications you're currently taking.",
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    duration: "1.5 hours",
    badge: "Elegance",
    shortDesc: "Teeth whitening, veneers, and smile makeovers.",
    fullDesc: "Transform your smile with our premium cosmetic solutions. We use state-of-the-art materials to give you a natural, radiant look that boosts your confidence.",
    whatToExpect: "Consultation, digital smile design, and application of porcelain veneers or whitening agents.",
    prepTips: "Avoid staining foods 24 hours before your procedure.",
  },
  {
    icon: Ruler,
    title: "Orthodontics",
    duration: "1 hour",
    badge: "Alignment",
    shortDesc: "Braces and clear aligners to straighten your smile.",
    fullDesc: "Straighten your teeth and improve your bite with our modern orthodontic treatments. We offer both traditional braces and discreet clear aligners.",
    whatToExpect: "Initial scan, treatment plan discussion, and fitting of your custom alignment solution.",
    prepTips: "Prepare for a thorough cleaning before your orthodontic fitting.",
  },
  {
    icon: Settings,
    title: "Dental Implants",
    duration: "2 hours",
    badge: "Advanced",
    shortDesc: "Permanent, natural-looking tooth replacements.",
    fullDesc: "The gold standard for tooth replacement. Our implants look, feel, and function exactly like natural teeth, restoring both your smile and your bite.",
    whatToExpect: "Consultation, surgical placement of the implant post, and later attachment of the custom crown.",
    prepTips: "Discuss any allergies or systemic health conditions with Dr. Anita before scheduling.",
  },
  {
    icon: Baby,
    title: "Paediatric Dentistry",
    duration: "30 min",
    badge: "Gentle",
    shortDesc: "Specialized, friendly care for our youngest patients.",
    fullDesc: "We create a fun and fearless dental environment for children. Our team is trained to handle pediatric needs with extra patience and care.",
    whatToExpect: "Kid-friendly checkup, gentle cleaning, and nutrition/oral hygiene education.",
    prepTips: "Talk to your child about the dentist in positive ways to reduce anxiety.",
  },
  {
    icon: ShieldAlert,
    title: "Emergency Care",
    duration: "Variable",
    badge: "Urgent",
    shortDesc: "Immediate attention for dental pain or accidents.",
    fullDesc: "We prioritize dental emergencies. Whether it's a cracked tooth or severe pain, we're here to provide immediate relief and long-term solutions.",
    whatToExpect: "Diagnostic assessment, immediate pain relief, and stabilized treatment for your emergency.",
    prepTips: "Call us immediately so we can prepare for your arrival.",
  },
]

export function ServicesGrid() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4 px-4 py-1">
            Our Expertise
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Specialized Dental Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive, patient-centered care using the latest technology 
            and a gentle Kerala touch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <HoverCard>
                <Dialog>
                  <DialogTrigger asChild>
                    <HoverCardTrigger asChild>
                      <Card className="group cursor-pointer border-2 border-transparent hover:border-accent/50 transition-all hover:shadow-xl hover:-translate-y-1">
                        <CardHeader>
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <service.icon className="h-6 w-6" />
                          </div>
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="bg-gold-light/40 text-accent font-bold">
                              {service.badge}
                            </Badge>
                            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {service.duration}
                            </span>
                          </div>
                          <CardTitle className="font-heading text-2xl text-primary">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {service.shortDesc}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0 border-t border-transparent flex justify-between items-center group-hover:border-border transition-all">
                          <span className="text-accent text-sm font-bold flex items-center">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        </CardFooter>
                      </Card>
                    </HoverCardTrigger>
                  </DialogTrigger>
                  
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-primary">{service.title} - Quick Info</h4>
                        <p className="text-sm text-muted-foreground">
                          Starts at {service.duration}. Includes consultation and diagnostic review.
                        </p>
                        <div className="flex items-center pt-2">
                          <Info className="mr-2 h-4 w-4 opacity-70" />{" "}
                          <span className="text-xs text-muted-foreground">
                            Hover for details, Click to book.
                          </span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>

                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
                          <service.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <DialogTitle className="font-heading text-2xl text-primary">{service.title}</DialogTitle>
                          <DialogDescription className="flex items-center gap-2">
                            <Clock className="h-3 w-3" /> {service.duration} duration • <Badge variant="outline">{service.badge}</Badge>
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    
                    <Tabs defaultValue="overview" className="mt-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="procedure">Procedure</TabsTrigger>
                        <TabsTrigger value="aftercare">Aftercare</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="p-4 bg-muted/20 rounded-md mt-2 min-h-[150px]">
                        <p className="text-muted-foreground leading-relaxed">
                          {service.fullDesc}
                        </p>
                      </TabsContent>
                      <TabsContent value="procedure" className="p-4 bg-muted/20 rounded-md mt-2 min-h-[150px]">
                        <h4 className="font-bold text-sm mb-2 text-primary">What to Expect:</h4>
                        <p className="text-muted-foreground mb-4">{service.whatToExpect}</p>
                        <h4 className="font-bold text-sm mb-2 text-primary">Preparation:</h4>
                        <p className="text-muted-foreground">{service.prepTips}</p>
                      </TabsContent>
                      <TabsContent value="aftercare" className="p-4 bg-muted/20 rounded-md mt-2 min-h-[150px]">
                        <p className="text-muted-foreground">
                          Post-treatment care is essential for lasting results. We provide detailed
                          home-care instructions and schedule follow-up visits to ensure your recovery 
                          is progressing as expected.
                        </p>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-3 mt-6">
                      <Button variant="outline" onClick={() => (window.location.hash = "#contact")}>Contact Us</Button>
                      <Button className="bg-accent hover:bg-accent/90 text-white font-bold">Book This Service</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </HoverCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
