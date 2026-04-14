import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex flex-col">
              <span className="font-heading text-2xl font-bold text-white leading-tight">
                Dr. Anita Mankottill
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Dental Clinic
              </span>
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed max-w-xs">
              Premium dental care driven by world-class expertise and local compassion. 
              Restoring smiles across Kerala for over 20 years.
            </p>
            <div className="flex gap-4">
              {/* Social icons removed temporarily to fix build issues */}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="#services" className="text-primary-foreground/70 hover:text-accent transition-colors">Services</Link></li>
              <li><Link href="#about" className="text-primary-foreground/70 hover:text-accent transition-colors">About Dr. Anita</Link></li>
              <li><Link href="#journey" className="text-primary-foreground/70 hover:text-accent transition-colors">Patient Journey</Link></li>
              <li><Link href="#faq" className="text-primary-foreground/70 hover:text-accent transition-colors">Common Questions</Link></li>
              <li><Link href="#contact" className="text-primary-foreground/70 hover:text-accent transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xl font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="h-5 w-5 text-accent shrink-0" />
                <span>123 Palm Grove Road, Near River Bridge, Kerala, 682001</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+91 484 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>info@anitadental.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xl font-bold mb-6">Registration</h4>
            <p className="text-primary-foreground/70 mb-4">
              Certified by the Kerala Dental Council and Indian Dental Association.
            </p>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Medical Reg No.</p>
              <p className="text-sm">KDH/2024/0987</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
          <p>© 2026 Dr. Anita Mankottill Dental Clinic. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
