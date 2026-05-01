'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { adminLogin } from '@/app/actions/auth'
import { PageTransition, FadeIn } from '@/components/animations/PageTransition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await adminLogin(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <PageTransition className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
      </div>

      <div className="container relative z-10" style={{ maxWidth: '420px' }}>
        <FadeIn>
          <div className="glass-heavy p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Inner subtle glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] mb-4">
                <ShieldCheck className="text-accent" size={32} strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-light tracking-tight">Admin Portal</h1>
              <p className="text-muted-foreground text-sm mt-2 font-light">Authorized Personnel Only</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Admin Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="authorized@gmail.com"
                  className="bg-black/40 border-white/10 focus-visible:ring-accent h-12 rounded-xl px-4 transition-all"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="bg-black/40 border-white/10 focus-visible:ring-accent h-12 rounded-xl px-4 transition-all"
                  required 
                />
              </div>

              <Button type="submit" className="w-full h-12 mt-6 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_14px_0_rgba(255,214,10,0.2)]" disabled={loading}>
                {loading ? 'Authenticating...' : 'Secure Access'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm font-light text-muted-foreground">
              <Link href="/" className="text-white hover:text-accent transition-colors flex items-center justify-center gap-2">
                ← Return to Main Portal
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
