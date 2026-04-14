"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const faqs = [
  {
    question: "Do you accept new patients?",
    answer: "Yes! We are always happy to welcome new families to our clinic in Kerala. Both resident and visiting patients are welcome."
  },
  {
    question: "How can I book an appointment?",
    answer: "You can book directly using the form on this website, call us at +91 484 123 4567, or visit us in person. We recommend booking in advance to ensure your preferred time slot."
  },
  {
    question: "Do you offer emergency dental care?",
    answer: "Absolutely. We prioritize dental emergencies such as severe pain, dental trauma, or sudden swelling. Please call our emergency line immediately if you have an urgent issue."
  },
  {
    question: "What is your clinic's specialty?",
    answer: "Dr. Anita Mankottill is an expert in Prosthodontics (restoring and replacing teeth), but we provide a full range of services including general dentistry, cosmetic surgery, and pediatric care."
  },
  {
    question: "How long does a typical checkup take?",
    answer: "A routine checkup and cleaning usually takes between 30 to 45 minutes, depending on the complexity and any specific concerns you might have."
  },
  {
    question: "Is there parking available at the clinic?",
    answer: "Yes, we have ample free parking available directly in front of and near the clinic entrance for our patients."
  },
  {
    question: "What should I bring to my first visit?",
    answer: "Please bring a valid ID, any previous dental records (if available), and a list of any current medications you are taking."
  },
  {
    question: "Do you offer teeth whitening?",
    answer: "Yes, we offer both in-clinic professional whitening and take-home whitening kits that deliver brilliant, lasting results safely."
  }
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary mb-4">Common Questions</Badge>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Everything You Need To Know
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about our services and what to expect 
            during your visit to Dr. Anita's clinic.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-primary/10">
                <AccordionTrigger className="font-heading text-xl font-bold text-primary hover:text-accent transition-colors py-6 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
