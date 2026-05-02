'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, User, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function StudentSidebar() {
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
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Browse Papers', href: '/dashboard/papers', icon: BookOpen },
    { name: 'My Profile', href: '/dashboard/profile', icon: User },
  ]

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{ background: 'rgba(15, 22, 35, 0.9)' }}
        className="lg:hidden fixed top-[18px] left-4 z-[60] p-2.5 rounded-xl border border-blue-500/20 text-white shadow-lg transition-transform active:scale-95 hover:border-blue-500/40 hover:shadow-blue-500/20"
        aria-label="Open Menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[50] lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        style={{ 
          background: 'linear-gradient(180deg, #0d1117 0%, #0f1623 60%, #0d1117 100%)',
          borderRight: '1px solid rgba(99, 179, 237, 0.1)'
        }}
        className={`fixed top-0 lg:top-[80px] left-0 bottom-0 w-[260px] flex flex-col pt-20 lg:pt-8 pb-6 px-4 z-[60] lg:z-40 transition-transform duration-300 ease-in-out will-change-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button Mobile */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-[18px] right-4 p-2 text-slate-500 hover:text-blue-300 transition-colors"
          aria-label="Close Menu"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col gap-2 flex-1">
          <div className="px-4 mb-4 text-[10px] font-semibold text-slate-600 uppercase tracking-[0.15em] mt-2 lg:mt-0">
            Menu
          </div>
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`group flex items-center gap-3 px-4 py-3.5 lg:py-3 rounded-2xl transition-all duration-200 relative overflow-hidden ${
                  isActive 
                    ? 'text-white font-medium' 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-blue-500/8 hover:border-l-2 hover:border-blue-500/50 hover:pl-[14px]'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-2xl"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(124,58,237,0.08))',
                      borderLeft: '3px solid #3b82f6',
                      boxShadow: 'inset 0 0 24px rgba(59,130,246,0.08)'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={20} className={`relative z-10 ${isActive ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                <span className="relative z-10">{link.name}</span>
              </Link>
            )
          })}
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 lg:py-3 rounded-2xl text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200 text-left font-medium group"
        >
          <LogOut size={20} className="text-red-500/60 group-hover:text-red-400 transition-colors" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  )
}
