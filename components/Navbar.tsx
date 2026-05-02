'use client'

import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()
  const { scrollY } = useScroll()

  // Apple-style navbar compression on scroll
  const navHeight = useTransform(scrollY, [0, 100], [80, 60])
  const navBackground = useTransform(scrollY, [0, 100], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'])
  const navBorder = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)'])

  useEffect(() => {
    // onAuthStateChange handles the initial session check AND subsequent changes.
    // This prevents the "stolen lock" error by keeping auth requests serialized.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh() // Ensures the server components sync with the logged-out state
  }

  return (
    <motion.nav
      style={{
        height: navHeight,
        background: navBackground,
        borderBottomColor: navBorder,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
      }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-300"
    >
      <div className="container flex justify-between items-center w-full">
        <Link href="/" className="flex items-center gap-3 group ml-14 lg:ml-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:bg-white/20 transition-colors">
            <GraduationCap className="text-white" size={24} strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-medium text-foreground tracking-tight leading-none mb-1">EE Portal</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Tezpur University</div>
          </div>
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="rounded-full glass text-foreground border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 font-medium px-6 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  )
}