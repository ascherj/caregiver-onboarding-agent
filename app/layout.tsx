import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Caregiver Onboarding',
  description: 'Complete your caregiver profile',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
