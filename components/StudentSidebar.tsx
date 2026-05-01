'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function StudentSidebar() {
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Browse Papers', href: '/dashboard/papers', icon: BookOpen },
    { name: 'My Profile', href: '/dashboard/profile', icon: User },
  ]

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-[80px] left-0 bottom-0 w-[260px] glass-heavy border-r border-white/5 flex flex-col pt-8 pb-6 px-4 z-40"
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="px-4 mb-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          Menu
        </div>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                isActive 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl"
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
        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 text-left font-medium"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </motion.aside>
  )
}
