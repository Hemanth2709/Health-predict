"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HeartPulse, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/about", label: "How it works" },
  { href: "/privacy", label: "Privacy" },
]

const Header = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-gray-900" aria-label="VitalScope home">
          <HeartPulse className="h-7 w-7 text-red-600" aria-hidden />
          <span className="text-xl font-semibold tracking-tight">VitalScope</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="text-gray-700 transition-colors hover:text-primary-700 aria-[current=page]:text-primary-700"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="bg-primary-600 text-white hover:bg-primary-700">
            <Link href="/predict">Start assessment</Link>
          </Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="mb-6">Menu</SheetTitle>
            <nav className="flex flex-col gap-4 text-base font-medium" aria-label="Mobile">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-gray-800">
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-2 bg-primary-600 text-white hover:bg-primary-700">
                <Link href="/predict" onClick={() => setOpen(false)}>
                  Start assessment
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export default Header
