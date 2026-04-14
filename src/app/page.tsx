import { Navbar } from "@/components/nav/navbar"
import { HeroSection } from "@/components/hero/hero-section"
import { ServicesGrid } from "@/components/services/services-grid"
import { AboutSection } from "@/components/about/about-section"
import { PatientJourney } from "@/components/journey/patient-journey"
import { TestimonialCarousel } from "@/components/testimonials/testimonial-carousel"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
import { FAQSection } from "@/components/faq/faq-section"
import { AppointmentForm } from "@/components/booking/appointment-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        
        {/* Trust Stats Bar in Hero or as separate section? 
            Added inside AboutSection as counters as per the component building step. 
        */}

        <ServicesGrid />
        <AboutSection />
        <PatientJourney />
        <TestimonialCarousel />
        <GalleryGrid />
        <FAQSection />
        <AppointmentForm />
      </main>
      <Footer />
    </div>
  )
}
