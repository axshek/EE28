'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, Database, Users, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function AdminSidebar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent background scrolling on mobile when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Upload Paper', href: '/admin/papers/upload', icon: Upload },
    { name: 'Manage Papers', href: '/admin/papers/manage', icon: Database },
    { name: 'Manage Users', href: '/admin/users/manage', icon: Users },
  ]

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-[18px] left-4 z-[60] p-2.5 glass-heavy rounded-xl border border-white/10 text-white shadow-lg transition-transform active:scale-95"
        aria-label="Open Menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={`fixed top-0 lg:top-[80px] left-0 bottom-0 w-[260px] glass-heavy border-r border-white/5 flex flex-col pt-20 lg:pt-8 pb-6 px-4 z-[60] lg:z-40 transition-transform duration-300 ease-in-out will-change-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button Mobile */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-[18px] right-4 p-2 text-muted-foreground hover:text-white transition-colors"
          aria-label="Close Menu"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col gap-2 flex-1">
          <div className="px-4 mb-4 text-[10px] font-semibold text-accent uppercase tracking-widest mt-2 lg:mt-0">
            Admin Portal
          </div>
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`group flex items-center gap-3 px-4 py-3.5 lg:py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'text-accent font-medium' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-admin"
                    className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={20} className="relative z-10" />
                <span className="relative z-10">{link.name}</span>
              </Link>
            )
          })}
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 lg:py-3 rounded-2xl text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 text-left font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  )
}
