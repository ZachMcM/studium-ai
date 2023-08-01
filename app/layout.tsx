import Provider from '@/components/Provider'
import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import Footer from '@/components/Footer'

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
      <body>
        <Provider>
          <div className='min-h-screen'>
            {children}
          </div>
          <Footer/>
          <Toaster/>
        </Provider>
      </body>
    </html>
  )
}
