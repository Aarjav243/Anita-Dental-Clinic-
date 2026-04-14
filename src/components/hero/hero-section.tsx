"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden flex items-center">
      {/* Remotion Background Placeholder */}
      <div className="absolute inset-0 z-0 bg-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark/50 z-10" />
        {/* Placeholder for Video Rendering */}
        <div className="w-full h-full flex items-center justify-center opacity-20">
            <div className="w-64 h-64 border-4 border-accent rounded-full animate-ping" />
        </div>
      </div>

      <div className="container relative z-20 mx-auto px-4">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 border-accent text-accent-foreground px-4 py-1 backdrop-blur-sm bg-accent/10">
              Trusted by 15,000+ Happy Patients across Kerala
            </Badge>
          </motion.div>

          <motion.h1
            className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Modern Dentistry <br />
            <span className="text-accent">With A Compassionate</span> <br />
            Kerala Touch
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Experience world-class dental care in the heart of Kerala. 
            Dr. Anita Mankottill combines 20 years of expertise with advanced technology 
            to bring you the smile you deserve.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold h-14 px-8 text-lg" asChild>
              <Link href="/book">
                Book Your Appointment <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10 hover:text-white h-14 px-8 text-lg">
              See How It Works <Play className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Kerala Inspired Decorative Element */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-10">
        <svg width="600" height="600" viewBox="0 0 100 100" className="text-accent fill-current">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" />
        </svg>
      </div>
    </section>
  )
}
