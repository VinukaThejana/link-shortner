import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Toast } from '@/components/utils/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Link Shortner',
  description: 'Shorten all your links for an easier and memorable sharing experince',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className='flex flex-col justify-center items-center'>
          {children}
        </main>
        <Toast />
      </body>
    </html>
  )
}
