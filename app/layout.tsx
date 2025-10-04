import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "NASA Farm Navigators: Blossoms of Bharat",
  description: "Educational farming simulation game powered by NASA and ISRO data",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} antialiased`}>
      <body className={`font-sans ${poppins.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Toaster />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
