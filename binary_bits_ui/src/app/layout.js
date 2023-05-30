import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Context from './context'


const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Binary Bits',
  description: 'Its a tech blog for everyone',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <Context>
        <Navbar />
        {children}
        <Footer/>
        </Context>
        </body>
    </html>
  )
}
