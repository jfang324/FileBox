import { Toaster } from '@/components/ui/toaster'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
})
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
})

export const metadata: Metadata = {
    title: 'FileBox',
    description: 'Manage and share files on your home network',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <UserProvider>
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    {children}
                    <Toaster />
                </body>
            </UserProvider>
        </html>
    )
}
