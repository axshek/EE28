import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'TU EE Portal | Tezpur University',
  description: 'Secure academic portal for the Department of Electrical Engineering, Tezpur University.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#080808' }}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
