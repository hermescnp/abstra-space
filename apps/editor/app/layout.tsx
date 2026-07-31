import { Agentation } from 'agentation'
import { GeistPixelSquare } from 'geist/font/pixel'
import type { Metadata } from 'next'
import { Barlow, Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { ClientBootstrap } from './client-bootstrap'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

/** Matches Golden Papers / Dot Science Workspace tooltip chrome. */
const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Abstra Space',
  description: 'Spatial design editor for buildings, interiors, and environments',
  icons: {
    icon: [
      {
        url: '/logos/abstra-space-symbol.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logos/abstra-space-symbol.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`dark ${geistSans.variable} ${geistMono.variable} ${GeistPixelSquare.variable} ${barlow.variable} ${inter.variable}`}
      lang="en"
      style={{ colorScheme: 'dark' }}
    >
      <head />
      <body className="font-sans antialiased">
        <ClientBootstrap>{children}</ClientBootstrap>
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </body>
    </html>
  )
}
