import type { Metadata } from 'next'
import { Fredoka } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import './globals.css'

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Moore's Ice Cream - Order Your Favorite Flavors",
  description: 'Premium handcrafted ice cream delivery. Order online with PhonePe payment or cash on delivery. Schedule callbacks for bulk orders.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} font-fredoka antialiased`}>
        <Header />
        <div className="pt-20">
          {children}
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
