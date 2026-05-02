import { createClient } from '@/lib/supabase/server'
import { User, Mail, Hash, Book } from 'lucide-react'
import { PageTransition, FadeIn, HoverCard } from '@/components/animations/PageTransition'
import { Badge } from '@/components/ui/badge'
import { formatSemester } from '@/lib/utils'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <PageTransition className="max-w-2xl mx-auto py-8">
      <FadeIn delay={0.1}>
        <div className="mb-10 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 mx-auto flex items-center justify-center border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] mb-6">
            <User size={40} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">{profile?.full_name}</h1>
          <Badge variant="outline" className="text-[10px] font-mono tracking-widest uppercase border-primary/30 text-primary bg-primary/10 rounded-full px-4 py-1.5">
            Student
          </Badge>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="glass-heavy rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-8">
            <h2 className="text-lg font-medium text-white mb-6">Account Details</h2>
            
            <div className="space-y-6">
              <HoverCard className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">University Email</div>
                  <div className="font-medium text-white">{user?.email}</div>
                </div>
              </HoverCard>
              
              <HoverCard className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                  <Hash size={20} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Roll Number</div>
                  <div className="font-medium text-white">{profile?.roll_number}</div>
                </div>
              </HoverCard>

              <HoverCard className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                  <Book size={20} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Current Semester</div>
                  <div className="font-medium text-white">{profile?.semester ? formatSemester(profile.semester) : ''}</div>
                </div>
              </HoverCard>
            </div>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  )
}
