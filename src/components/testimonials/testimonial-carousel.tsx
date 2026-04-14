"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Rajesh K.",
    location: "Kochi, Kerala",
    quote: "Dr. Anita is incredibly gentle. I've always had dental anxiety, but her calm approach made my tooth extraction completely stress-free.",
    rating: 5,
    initials: "RK"
  },
  {
    name: "Meera V.",
    location: "Trivandrum, Kerala",
    quote: "The cosmetic treatment I received here changed my life. I can finally smile with confidence in all my family photos! Best clinic in the state.",
    rating: 5,
    initials: "MV"
  },
  {
    name: "Sreejith M.",
    location: "Kozhikode, Kerala",
    quote: "Very professional and high-tech equipment. The patient journey was so easy, and the follow-up care was excellent. Highly recommended.",
    rating: 5,
    initials: "SM"
  },
  {
    name: "Anjali S.",
    location: "Thrissur, Kerala",
    quote: "I brought my 6-year-old for her first checkup. Dr. Anita made it feel like a game! No tears, and my daughter is actually excited for her next visit.",
    rating: 5,
    initials: "AS"
  }
]

export function TestimonialCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Quote className="h-12 w-12 text-accent/20 mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Smiles We've Transformed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from our patients across the state who have experienced 
            the compassionate care of Dr. Anita Mankottill.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {testimonials.map((testimonial, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <Card className="h-full border-none shadow-lg bg-background">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex gap-1 mb-6 text-accent">
                        {Array.from({ length: testimonial.rating }).map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      
                      <p className="text-muted-foreground italic leading-relaxed mb-8 flex-grow">
                        "{testimonial.quote}"
                      </p>
                      
                      <div className="flex items-center gap-4 mt-auto">
                        <Avatar className="h-12 w-12 border-2 border-primary-light">
                          <AvatarImage src={`/avatars/${testimonial.initials.toLowerCase()}.jpg`} />
                          <AvatarFallback className="bg-primary text-white text-xs font-bold">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-primary leading-none mb-1">
                            {testimonial.name}
                          </p>
                          <p className="text-xs text-muted-foreground tracking-wide">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12 border-primary text-primary hover:bg-primary hover:text-white" />
              <CarouselNext className="-right-12 border-primary text-primary hover:bg-primary hover:text-white" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
