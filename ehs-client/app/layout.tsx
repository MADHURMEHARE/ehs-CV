import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ['latin'] })
const AuthHeaderButton = dynamic(() => import('@/components/AuthHeaderButton'), { ssr: false })

export const metadata: Metadata = {
  title: 'EHS — Exclusive Household Staff | AI-Powered CV Formatter',
  description: 'Professional CV formatting and candidate management by Exclusive Household Staff. Transform raw CVs into polished, EHS-standard documents.',
  keywords: 'EHS, Exclusive Household Staff, CV Formatter, AI CV Processing, Professional CV Formatting',
  authors: [{ name: 'Exclusive Household Staff' }],
  creator: 'Exclusive Household Staff',
  publisher: 'Exclusive Household Staff',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'EHS — Exclusive Household Staff',
    description: 'AI-Powered CV Formatter by Exclusive Household Staff',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EHS — Exclusive Household Staff',
    description: 'AI-Powered CV Formatter by Exclusive Household Staff',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/ehs-logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/ehs-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/ehs-logo.svg" />
        <meta name="theme-color" content="#DC2626" />
        <meta name="msapplication-TileColor" content="#DC2626" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-3">
                  <Link href="/" className="group flex items-center space-x-3">
                    <img src="/ehs-logo.svg" alt="EHS" className="h-14 w-auto hover:scale-105 transition-transform duration-300" />
                    <div className="hidden sm:block">
                      <div className="text-xl font-bold text-red-600">EHS</div>
                      <div className="text-xs text-gray-600 font-medium">Exclusive Household Staff</div>
                    </div>
                  </Link>
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                  <Link href="/" className="text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50">Home</Link>
                  <Link href="/upload" className="text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50">Upload CV</Link>
                  <Link href="/dashboard" className="text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50">Dashboard</Link>
                  <Link href="/registration" className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">Registration Form</Link>
                </nav>

                <div className="flex items-center space-x-4 ml-4">
                  <AuthHeaderButton />
                </div>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-12">
            {children}
          </main>

          <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700 mt-auto">
            <div className="container mx-auto px-4 py-12">
              <div className="text-center">
                <div className="flex justify-center items-center mb-6 space-x-3">
                  <img src="/ehs-logo.svg" alt="EHS" className="h-10 w-auto" />
                  <div>
                    <div className="text-lg font-bold text-red-400">EHS</div>
                    <div className="text-xs text-gray-400">Exclusive Household Staff</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2">&copy; 2024 Exclusive Household Staff. All rights reserved.</p>
                <p className="text-gray-400 text-xs">AI-Powered CV Formatting & Professional Document Management</p>
              </div>
            </div>
          </footer>
        </div>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: '#fff',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)',
            },
          }}
        />
      </body>
    </html>
  )
}
