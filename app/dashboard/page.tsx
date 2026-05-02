import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, User, ArrowRight } from 'lucide-react'
import { PageTransition, FadeIn, HoverCard } from '@/components/animations/PageTransition'

import Greeting from '@/components/Greeting'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  // Get recent papers
  const { data: recentPapers } = await supabase
    .from('question_papers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <PageTransition>
      <div className="mb-10">
        <FadeIn delay={0.1}>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">
            <Greeting name={profile?.full_name?.split(' ')[0] || 'Student'} />
          </h1>
          <p className="text-muted-foreground font-light text-lg">Here's your academic overview for today.</p>
        </FadeIn>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <FadeIn delay={0.2}>
          <Link href="/dashboard/papers" className="block h-full">
            <HoverCard className="glass-heavy p-8 rounded-3xl h-full flex flex-col justify-between border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="text-primary" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <BookOpen size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-medium mb-2 text-white">Browse Papers</h2>
                <p className="text-muted-foreground font-light">Access Mid-Sem & End-Sem question papers.</p>
              </div>
            </HoverCard>
          </Link>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <Link href="/dashboard/profile" className="block h-full">
            <HoverCard className="glass-heavy p-8 rounded-3xl h-full flex flex-col justify-between border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="text-white" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <User size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-medium mb-2 text-white">My Profile</h2>
                <p className="text-muted-foreground font-light">View and manage your student details.</p>
              </div>
            </HoverCard>
          </Link>
        </FadeIn>
      </div>

      <FadeIn delay={0.4}>
        <div className="glass p-8 rounded-3xl border border-white/5">
          <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
            <h2 className="text-xl font-medium text-white tracking-tight">Recently Added Papers</h2>
            <Link href="/dashboard/papers" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {recentPapers && recentPapers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPapers.map((paper, idx) => (
                <FadeIn key={paper.id} delay={0.5 + (idx * 0.1)}>
                  <HoverCard className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-primary/50 transition-colors">
                    <div className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-2">{paper.subject_code}</div>
                    <h3 className="font-medium text-white mb-4 truncate text-lg" title={paper.subject_name}>{paper.subject_name}</h3>
                    <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                      <span className="glass px-3 py-1.5 rounded-full">{paper.semester}</span>
                      <span className="glass px-3 py-1.5 rounded-full">{paper.year}</span>
                      <span className="glass px-3 py-1.5 rounded-full">{paper.exam_type}</span>
                    </div>
                  </HoverCard>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground font-light">No question papers uploaded yet.</p>
            </div>
          )}
        </div>
      </FadeIn>
    </PageTransition>
  )
}
