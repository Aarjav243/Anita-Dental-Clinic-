import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Dr. Anita Mankottill | Exceptional Dental Care in Kerala",
  description: "Experience modern dentistry with compassion at Dr. Anita Mankottill Dental Clinic. Located in the heart of Kerala, we offer cosmetic, implant, and general dental services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${cormorant.variable} ${dmSans.variable} font-body min-h-full flex flex-col antialiased`}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
