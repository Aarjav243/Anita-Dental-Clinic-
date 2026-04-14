"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react"

const images = [
  { id: 1, category: "cosmetic", title: "Smile Makeover", alt: "Teeth whitening result" },
  { id: 2, category: "orthodontics", title: "Alignment Correction", alt: "Braces before and after" },
  { id: 3, category: "implants", title: "Permanent Restoration", alt: "Dental implant result" },
  { id: 4, category: "cosmetic", title: "Veneers Fitting", alt: "Porcelain veneers result" },
  { id: 5, category: "orthodontics", title: "Invisible Alignment", alt: "Clear aligners results" },
  { id: 6, category: "implants", title: "Full Mouth Reconstruction", alt: "Complete implant restoration" },
]

export function GalleryGrid() {
  const [selectedId, setSelectedId] = React.useState<number | null>(null)

  const handleNext = () => {
    if (selectedId === null) return
    const nextId = selectedId >= images.length ? 1 : selectedId + 1
    setSelectedId(nextId)
  }

  const handlePrev = () => {
    if (selectedId === null) return
    const prevId = selectedId <= 1 ? images.length : selectedId - 1
    setSelectedId(prevId)
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedId === null) return
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "Escape") setSelectedId(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedId])

  const selectedImage = images.find(img => img.id === selectedId)

  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary mb-4">Patient Results</Badge>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Gallery of Smiles
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Witness the transformations we've achieved through personalized, 
            compassionate dental care.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="cosmetic">Cosmetic</TabsTrigger>
              <TabsTrigger value="orthodontics">Orthodontics</TabsTrigger>
              <TabsTrigger value="implants">Implants</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <GalleryCard key={image.id} image={image} onSelect={() => setSelectedId(image.id)} />
              ))}
            </div>
          </TabsContent>
          
          {["cosmetic", "orthodontics", "implants"].map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.filter(img => img.category === cat).map((image) => (
                  <GalleryCard key={image.id} image={image} onSelect={() => setSelectedId(image.id)} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={selectedId !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/90 text-white overflow-hidden">
            <DialogTitle className="sr-only">Image Gallery Preview</DialogTitle>
            <div className="relative w-full h-full flex items-center justify-center p-4 min-min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center"
                >
                  <div className="w-full aspect-[4/3] bg-muted/20 rounded-lg flex items-center justify-center border border-white/10 group relative overflow-hidden">
                    <span className="font-heading text-2xl text-white/40">{selectedImage?.title} Placeholder</span>
                    {/* Add actual <img> here with src={selectedImage.path} */}
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="font-heading text-2xl font-bold">{selectedImage?.title}</h3>
                    <p className="text-white/60 capitalize">{selectedImage?.category} Results • {selectedId} / {images.length}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-10">
                <Button size="icon" variant="ghost" onClick={handlePrev} className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white">
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-10">
                <Button size="icon" variant="ghost" onClick={handleNext} className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white">
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
              <div className="absolute top-6 right-6">
                <Button size="icon" variant="ghost" onClick={() => setSelectedId(null)} className="h-10 w-10 text-white/60 hover:text-white">
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

function GalleryCard({ image, onSelect }: { image: typeof images[0], onSelect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-transparent hover:border-accent shadow-md transition-all"
      onClick={onSelect}
    >
      <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center relative">
        <span className="font-heading text-lg text-muted-foreground">{image.title}</span>
        <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="h-10 w-10 text-white" />
        </div>
      </div>
      <div className="p-4 bg-background border-t border-muted">
        <Badge variant="secondary" className="mb-2 uppercase text-[10px] font-bold tracking-widest">{image.category}</Badge>
        <h4 className="font-heading text-lg font-bold text-primary">{image.title}</h4>
      </div>
    </motion.div>
  )
}
