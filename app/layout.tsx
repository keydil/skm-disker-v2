import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Survey Kepuasan Masyarakat (SKM)",
  description: "Sistem Survey Kepuasan Masyarakat untuk pelayanan publik",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/disnaker-logo.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/disnaker-logo.svg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/disnaker-logo.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
