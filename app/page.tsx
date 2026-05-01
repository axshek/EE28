import Link from 'next/link'
import { BookOpen, GraduationCap, Lock, Search } from 'lucide-react'
import { PageTransition, FadeIn, HoverCard } from '@/components/animations/PageTransition'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <PageTransition className="relative min-h-screen overflow-hidden bg-black text-foreground">
      {/* Deep Space Background Mesh with Floating Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen pt-[80px]">
        {/* Hero Section */}
        <section className="container flex-1 flex flex-col items-center justify-center text-center gap-8 py-20">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-heavy text-xs font-medium uppercase tracking-widest text-accent/80 mb-4">
              <GraduationCap size={14} />
              <span>Tezpur University · Estd. 1994</span>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50 max-w-4xl leading-tight">
              Electrical Engineering Portal
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <h2 className="text-xl md:text-2xl font-light text-muted-foreground max-w-2xl mx-auto">
              A secure, seamless, and elegant academic repository for previous year question papers.
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(10,132,255,0.4)] border border-primary/50">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-full glass-heavy text-foreground hover:bg-white/10 text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98] border-white/10">
                Create Account
              </Button>
            </Link>
          </FadeIn>
        </section>

        {/* Features Section */}
        <section className="container pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <FadeIn delay={0.5}>
              <HoverCard className="glass-heavy p-8 rounded-3xl h-full flex flex-col border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                  <Lock size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium mb-3">Secure Access</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Exclusive to authenticated Tezpur University students via domain-restricted email verification.
                </p>
              </HoverCard>
            </FadeIn>

            <FadeIn delay={0.6}>
              <HoverCard className="glass-heavy p-8 rounded-3xl h-full flex flex-col border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                  <Search size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium mb-3">Advanced Search</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Easily filter question papers by semester, subject code, year, and examination type with instant results.
                </p>
              </HoverCard>
            </FadeIn>

            <FadeIn delay={0.7}>
              <HoverCard className="glass-heavy p-8 rounded-3xl h-full flex flex-col border border-white/5 sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                  <BookOpen size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium mb-3">Comprehensive Archive</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  A continuously updated, beautifully organized repository of Mid-Semester and End-Semester examination papers.
                </p>
              </HoverCard>
            </FadeIn>

          </div>
        </section>
        
        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/5 glass text-muted-foreground font-light text-sm">
          <p>© {new Date().getFullYear()} Tezpur University. Designed for excellence.</p>
          <p className="mt-2">
            <Link href="/admin-login" className="hover:text-primary transition-colors">Admin Access</Link>
          </p>
        </footer>
      </div>
    </PageTransition>
  )
}
