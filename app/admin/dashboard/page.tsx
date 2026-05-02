import { createClient } from '@/lib/supabase/server'
import { Users, FileText, Activity, ArrowRight } from 'lucide-react'
import { PageTransition, FadeIn, HoverCard } from '@/components/animations/PageTransition'
import { Badge } from '@/components/ui/badge'
import { formatSemester } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student')

  const { count: papersCount } = await supabase
    .from('question_papers')
    .select('*', { count: 'exact', head: true })

  const { data: recentPapers } = await supabase
    .from('question_papers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <PageTransition>
      <div className="mb-10">
        <FadeIn delay={0.1}>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground font-light text-lg">Platform Overview & Statistics</p>
        </FadeIn>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <FadeIn delay={0.2}>
          <HoverCard className="glass-heavy p-8 rounded-3xl h-full flex flex-col border border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <Users size={24} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Students</div>
            </div>
            <div className="text-5xl font-light tracking-tighter text-white">{usersCount || 0}</div>
          </HoverCard>
        </FadeIn>

        <FadeIn delay={0.3}>
          <HoverCard className="glass-heavy p-8 rounded-3xl h-full flex flex-col border border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <FileText size={24} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Papers Uploaded</div>
            </div>
            <div className="text-5xl font-light tracking-tighter text-white">{papersCount || 0}</div>
          </HoverCard>
        </FadeIn>

        <FadeIn delay={0.4}>
          <HoverCard className="glass-heavy p-8 rounded-3xl h-full flex flex-col border border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <Activity size={24} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">System Status</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <div className="text-3xl font-light text-white">Online</div>
            </div>
          </HoverCard>
        </FadeIn>
      </div>

      <FadeIn delay={0.5}>
        <div className="glass-heavy rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-medium text-white tracking-tight">Recent Uploads</h2>
          </div>
          
          {recentPapers && recentPapers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <th className="py-4 px-6 font-semibold">Subject</th>
                    <th className="py-4 px-6 font-semibold">Code</th>
                    <th className="py-4 px-6 font-semibold">Semester</th>
                    <th className="py-4 px-6 font-semibold">Year</th>
                    <th className="py-4 px-6 font-semibold">Date Uploaded</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light">
                  {recentPapers.map((paper, idx) => (
                    <tr key={paper.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx === recentPapers.length - 1 ? 'border-none' : ''}`}>
                      <td className="py-4 px-6 text-white font-medium">{paper.subject_name}</td>
                      <td className="py-4 px-6"><Badge variant="outline" className="border-accent/30 text-accent bg-accent/10 rounded-full px-2 py-0.5 font-mono font-medium">{paper.subject_code}</Badge></td>
                      <td className="py-4 px-6 text-muted-foreground">{formatSemester(paper.semester)}</td>
                      <td className="py-4 px-6 text-muted-foreground">{paper.year}</td>
                      <td className="py-4 px-6 text-muted-foreground">{new Date(paper.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground font-light">
              No question papers uploaded yet.
            </div>
          )}
        </div>
      </FadeIn>
    </PageTransition>
  )
}
