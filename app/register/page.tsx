'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { signup } from '@/app/actions/auth'
import { PageTransition, FadeIn } from '@/components/animations/PageTransition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <PageTransition className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black py-12">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <div className="container relative z-10" style={{ maxWidth: '480px' }}>
        <FadeIn>
          <div className="glass-heavy p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Inner subtle glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] mb-4">
                <GraduationCap className="text-white" size={32} strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-light tracking-tight">Create Account</h1>
              <p className="text-muted-foreground text-sm mt-2 font-light">Join the EE Portal</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Full Name</Label>
                <Input id="fullName" name="fullName" type="text" className="bg-black/40 border-white/10 focus-visible:ring-primary h-12 rounded-xl px-4 transition-all" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNumber" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Roll Number</Label>
                  <Input id="rollNumber" name="rollNumber" type="text" className="bg-black/40 border-white/10 focus-visible:ring-primary h-12 rounded-xl px-4 transition-all" required />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="semester" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Semester</Label>
                  <Select name="semester" required>
                    <SelectTrigger className="bg-black/40 border-white/10 focus:ring-primary h-12 rounded-xl px-4 transition-all w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="glass-heavy border-white/10 text-foreground rounded-xl">
                      {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={`${s}th Semester`} className="rounded-lg focus:bg-white/10">{s}th Semester</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">University Email</Label>
                <Input id="email" name="email" type="email" placeholder="@tezu.ac.in" className="bg-black/40 border-white/10 focus-visible:ring-primary h-12 rounded-xl px-4 transition-all" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Password</Label>
                  <Input id="password" name="password" type="password" className="bg-black/40 border-white/10 focus-visible:ring-primary h-12 rounded-xl px-4 transition-all" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Confirm</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" className="bg-black/40 border-white/10 focus-visible:ring-primary h-12 rounded-xl px-4 transition-all" required />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 mt-6 rounded-xl bg-white text-black hover:bg-white/90 font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]" disabled={loading}>
                {loading ? 'Creating Account...' : 'Continue'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm font-light text-muted-foreground">
              <p>Already have an account? <Link href="/login" className="text-white hover:text-primary transition-colors">Sign in</Link></p>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
