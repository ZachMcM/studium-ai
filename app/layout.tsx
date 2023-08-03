import Provider from '@/components/Provider'
import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import Footer from '@/components/Footer'
import LocalFont from "next/font/local";

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export const metadata: Metadata = {
  title: 'Study AI',
  description: 'Helping students with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body className={`${calSans.variable}`}>
        <Provider>
          {children}
          <Toaster/>
        </Provider>
      </body>
    </html>
  )
}
