import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/navbar/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Binary Bits',
  description: 'Its a tech blog for everyone',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Navbar></Navbar>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
