import './globals.css'
import React from 'react'
import Link from 'next/link'

export const metadata = { title: 'Shop&Go — Admin', description: 'Backoffice' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-black/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-[#FF5C1C] text-white font-bold">S</span>
            <h1 className="text-xl font-extrabold">Shop&Go — Admin</h1>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="hover:underline" href="/">Dashboard</Link>
            <Link className="hover:underline" href="/orders">Objednávky</Link>
            <Link className="hover:underline" href="/unassigned">Nepřiřazené</Link>
            <Link className="hover:underline" href="/couriers">Kurýři</Link>
            <Link className="hover:underline" href="/settings">Nastavení</Link>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}
