'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { login } from '@/app/actions/auth'
import { PageTransition, FadeIn } from '@/components/animations/PageTransition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <PageTransition className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
      </div>

      <div className="container relative z-10" style={{ maxWidth: '420px' }}>
        <FadeIn>
          <div className="glass-heavy p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Inner subtle glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] mb-4">
                <GraduationCap className="text-white" size={32} strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-light tracking-tight">Sign In</h1>
              <p className="text-muted-foreground text-sm mt-2 font-light">Access the EE Portal</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">University Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@tezu.ac.in"
                  className="bg-black/40 border-white/10 focus-visible:ring-primary h-12 rounded-xl px-4 transition-all"
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
                  className="bg-black/40 border-white/10 focus-visible:ring-primary h-12 rounded-xl px-4 transition-all"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12 mt-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_14px_0_rgba(10,132,255,0.39)]" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm font-light text-muted-foreground">
              <p>Don't have an account? <Link href="/register" className="text-white hover:text-primary transition-colors">Create one</Link></p>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
