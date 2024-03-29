import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Context from './context'
import { Toaster } from 'react-hot-toast';


const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Binary Bits',
  description: 'Its a tech blog for everyone',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className + " "+"flex flex-col justify-items-end min-h-screen"} >
        <Context>
        <Navbar />
        {children}
        <Footer/>
        </Context>
        <Toaster />
        </body>
    </html>
  )
}
