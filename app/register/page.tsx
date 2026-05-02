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
import { formatSemester } from '@/lib/utils'

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
    <PageTransition className="min-h-screen flex items-center justify-center pt-24 pb-6 px-4 relative overflow-hidden bg-black">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <FadeIn>
          <div className="w-full max-w-lg glass-heavy rounded-3xl border border-white/10 p-6 md:p-8 relative overflow-hidden shadow-2xl">
            {/* Inner subtle glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="flex flex-col items-center mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] mb-4">
                <GraduationCap className="text-white" size={24} strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-light tracking-tight">Create Account</h1>
              <p className="text-muted-foreground text-sm mt-2 font-light">Join the EE Portal</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* 1. FULL NAME */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-muted-foreground font-normal text-[10px] uppercase tracking-wider">Full Name</Label>
                <Input id="fullName" name="fullName" type="text" className="bg-black/40 border-white/10 focus-visible:ring-primary h-10 rounded-xl px-4 transition-all" required />
              </div>

              {/* 2. ROLL NUMBER + SEMESTER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="rollNumber" className="text-muted-foreground font-normal text-[10px] uppercase tracking-wider">Roll Number</Label>
                  <Input id="rollNumber" name="rollNumber" type="text" className="bg-black/40 border-white/10 focus-visible:ring-primary h-10 rounded-xl px-4 transition-all" required />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <Label htmlFor="semester" className="text-muted-foreground font-normal text-[10px] uppercase tracking-wider">Semester</Label>
                  <Select name="semester" required>
                    <SelectTrigger className="bg-black/40 border-white/10 focus:ring-primary h-10 rounded-xl px-4 transition-all w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 text-foreground rounded-xl z-[100] bg-[#0f1117]">
                      {['1st Semester','2nd Semester','3rd Semester','4th Semester','5th Semester','6th Semester','7th Semester','8th Semester'].map(s => (
                        <SelectItem key={s} value={s} className="rounded-lg focus:bg-white/10">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 3. UNIVERSITY EMAIL */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-muted-foreground font-normal text-[10px] uppercase tracking-wider">University Email</Label>
                <Input id="email" name="email" type="email" placeholder="@tezu.ac.in" className="bg-black/40 border-white/10 focus-visible:ring-primary h-10 rounded-xl px-4 transition-all" required />
              </div>
              
              {/* 4. PASSWORD + CONFIRM PASSWORD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-muted-foreground font-normal text-[10px] uppercase tracking-wider">Password</Label>
                  <Input id="password" name="password" type="password" className="bg-black/40 border-white/10 focus-visible:ring-primary h-10 rounded-xl px-4 transition-all" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-muted-foreground font-normal text-[10px] uppercase tracking-wider">Confirm</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" className="bg-black/40 border-white/10 focus-visible:ring-primary h-10 rounded-xl px-4 transition-all" required />
                </div>
              </div>

              {/* 5. LINKEDIN PROFILE */}
              <div className="opacity-50 hover:opacity-80 transition-opacity duration-300">
                <Label className="text-muted-foreground font-normal text-[10px] uppercase tracking-wider">
                  LinkedIn Profile
                  <span className="normal-case tracking-normal ml-1">
                    (optional · For future Alumni Meet)
                  </span>
                </Label>
                <Input
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="bg-black/40 border-white/10 h-10 rounded-xl px-4 transition-all mt-1.5"
                />
              </div>

              <Button type="submit" className="w-full h-10 mt-2 rounded-xl bg-white text-black hover:bg-white/90 font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]" disabled={loading}>
                {loading ? 'Creating Account...' : 'Continue'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm font-light text-muted-foreground">
              <p>Already have an account? <Link href="/login" className="text-white hover:text-primary transition-colors">Sign in</Link></p>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
