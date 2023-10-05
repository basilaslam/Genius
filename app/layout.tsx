import './globals.css'
import type { Metadata } from 'next'
import {ClerkProvider} from '@clerk/nextjs'
import { ModalProvider } from '@/components/modal-provider'

export const metadata: Metadata = {
  title: 'Genius',
  description: 'AI platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <ModalProvider/>
      <body>{children}</body>
    </html>
    </ClerkProvider>
  )
}
