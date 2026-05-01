'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { deletePaper } from '@/app/actions/papers'
import { Search, Trash2, FileText, Loader2 } from 'lucide-react'
import { PageTransition, FadeIn } from '@/components/animations/PageTransition'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function ManagePapersPage() {
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchPapers()
  }, [])

  const fetchPapers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('question_papers')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (data) setPapers(data)
    setLoading(false)
  }

  const handleDelete = async (id: string, file_url: string) => {
    if (!confirm('Are you sure you want to delete this paper? This action cannot be undone.')) return
    
    setDeletingId(id)
    const result = await deletePaper(id, file_url)
    
    if (result.success) {
      setPapers(papers.filter(p => p.id !== id))
    } else {
      alert(result.error)
    }
    setDeletingId(null)
  }

  const filteredPapers = papers.filter(p => 
    p.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.subject_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageTransition>
      <div className="mb-10 flex justify-between items-end flex-wrap gap-6">
        <FadeIn delay={0.1}>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">Manage Papers</h1>
          <p className="text-muted-foreground font-light text-lg">View and manage uploaded question papers.</p>
        </FadeIn>
        
        <FadeIn delay={0.2} className="w-full md:w-auto md:min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
            <Input 
              type="text" 
              placeholder="Search papers..." 
              className="bg-black/40 border-white/10 focus-visible:ring-accent h-12 rounded-xl pl-11 transition-all w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.3}>
        <div className="glass-heavy rounded-3xl border border-white/5 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/5" />)}
            </div>
          ) : filteredPapers.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={48} className="mx-auto text-muted-foreground/30 mb-4" strokeWidth={1} />
              <h3 className="text-xl font-light text-white">No papers found</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-muted-foreground bg-white/[0.02]">
                    <th className="py-5 px-6 font-semibold">Subject Name</th>
                    <th className="py-5 px-6 font-semibold">Code</th>
                    <th className="py-5 px-6 font-semibold">Semester</th>
                    <th className="py-5 px-6 font-semibold">Year</th>
                    <th className="py-5 px-6 font-semibold">Exam Type</th>
                    <th className="py-5 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light">
                  {filteredPapers.map((paper, idx) => (
                    <tr key={paper.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${idx === filteredPapers.length - 1 ? 'border-none' : ''}`}>
                      <td className="py-5 px-6 text-white font-medium">{paper.subject_name}</td>
                      <td className="py-5 px-6">
                        <Badge variant="outline" className="border-accent/30 text-accent bg-accent/10 rounded-full px-2 py-0.5 font-mono font-medium">{paper.subject_code}</Badge>
                      </td>
                      <td className="py-5 px-6 text-muted-foreground">{paper.semester}</td>
                      <td className="py-5 px-6 text-muted-foreground">{paper.year}</td>
                      <td className="py-5 px-6">
                        <Badge variant="secondary" className="glass bg-white/5 font-normal text-muted-foreground border-transparent">{paper.exam_type}</Badge>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(paper.id, paper.file_url)}
                          disabled={deletingId === paper.id}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          title="Delete Paper"
                        >
                          {deletingId === paper.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeIn>
    </PageTransition>
  )
}
