import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://techradar.yourdomain.com"),
  title: {
    default: "Developer Technology Radar | Best Software Tools & Frameworks",
    template: "%s | Developer Technology Radar",
  },
  description:
    "Compare and evaluate the best software development tools, frameworks, and libraries. Our interactive technology radar helps developers make informed decisions for their tech stack.",
  keywords:
    "technology radar, software comparison, best development tools, JavaScript frameworks, frontend libraries, developer tools, tech stack, software recommendations",
  authors: [{ name: "Your Company Name" }],
  creator: "Your Company Name",
  publisher: "Your Company Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techradar.yourdomain.com",
    title: "Developer Technology Radar | Best Software Tools & Frameworks",
    description:
      "Compare and evaluate the best software development tools, frameworks, and libraries for your next project.",
    siteName: "Developer Technology Radar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Developer Technology Radar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Technology Radar | Best Software Tools & Frameworks",
    description:
      "Compare and evaluate the best software development tools, frameworks, and libraries for your next project.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Developer Technology Radar",
              description: "Interactive tool for comparing and evaluating software development technologies",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "Your Company Name",
                url: "https://yourdomain.com",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'