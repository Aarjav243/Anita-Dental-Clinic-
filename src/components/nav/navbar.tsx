"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const services = [
  {
    title: "General Dentistry",
    href: "/#services",
    description: "Routine checkups, cleanings, and preventative care for all ages.",
  },
  {
    title: "Cosmetic Dentistry",
    href: "/#services",
    description: "Teeth whitening, veneers, and smile makeovers for a radiant look.",
  },
  {
    title: "Orthodontics",
    href: "/#services",
    description: "Braces and clear aligners to straighten your teeth and improve your bite.",
  },
  {
    title: "Dental Implants",
    href: "/#services",
    description: "Permanent solutions for missing teeth that look and feel natural.",
  },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex flex-col">
            <span className="font-heading text-xl font-bold text-primary leading-tight">
              Dr. Anita Mankottill
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Dental Clinic
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {services.map((service) => (
                      <ListItem
                        key={service.title}
                        title={service.title}
                        href={service.href}
                      >
                        {service.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#about" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#journey" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                    Patient Journey
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#contact" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Button className="bg-accent hover:bg-accent/90 text-white font-bold" asChild>
            <Link href="/book">Book Appointment</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-6">
              <SheetTitle className="text-left font-heading text-xl text-primary mb-6">
                Menu
              </SheetTitle>
              <nav className="flex flex-col gap-4">
                <Link href="#services" className="text-lg font-medium hover:text-accent">
                  Services
                </Link>
                <Link href="#about" className="text-lg font-medium hover:text-accent">
                  About
                </Link>
                <Link href="#journey" className="text-lg font-medium hover:text-accent">
                  Patient Journey
                </Link>
                <Link href="#contact" className="text-lg font-medium hover:text-accent">
                  Contact
                </Link>
                <Button className="mt-4 bg-accent hover:bg-accent/90 text-white font-bold w-full" asChild>
                  <Link href="/book">Book Appointment</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/5 hover:text-accent focus:bg-accent/5 focus:text-accent",
            className
          )}
          {...props}
        >
          <div className="text-sm font-bold leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
