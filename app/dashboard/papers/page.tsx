'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSignedUrl } from '@/app/actions/papers'
import { Search, Download, FileText, Loader2 } from 'lucide-react'
import { PageTransition, FadeIn, HoverCard } from '@/components/animations/PageTransition'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { formatSemester } from '@/lib/utils'

export default function BrowsePapersPage() {
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('all')
  const [examTypeFilter, setExamTypeFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  const supabase = createClient()

  useEffect(() => {
    fetchPapers()
  }, [])

  const fetchPapers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('question_papers')
      .select('*')
      .order('year', { ascending: false })
      .order('semester', { ascending: true })
      
    if (data) setPapers(data)
    setLoading(false)
  }

  const handleDownload = async (paperId: string, fileUrl: string) => {
    setDownloadingId(paperId)
    const result = await getSignedUrl(fileUrl)
    
    if (result.url) {
      const a = document.createElement('a')
      a.href = result.url
      a.download = fileUrl
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      alert("Failed to generate download link.")
    }
    setDownloadingId(null)
  }

  const filteredPapers = papers.filter(p => {
    const matchesSearch = 
      p.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.subject_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSem = semesterFilter !== 'all' ? p.semester === semesterFilter : true;
    const matchesExam = examTypeFilter !== 'all' ? p.exam_type === examTypeFilter : true;
    const matchesYear = yearFilter !== 'all' ? p.year === yearFilter : true;
    return matchesSearch && matchesSem && matchesExam && matchesYear;
  })

  const uniqueYears = Array.from(new Set(papers.map(p => p.year))).sort().reverse()

  return (
    <PageTransition>
      <FadeIn delay={0.1}>
        <div className="mb-10">
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">Question Papers</h1>
          <p className="text-muted-foreground font-light text-lg">Search, filter, and download past examination papers.</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="glass p-6 rounded-3xl border border-white/5 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
              <Input 
                type="text" 
                placeholder="Search by subject name or code..." 
                className="bg-black/40 border-white/10 focus-visible:ring-primary h-12 rounded-xl pl-11 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4 flex-wrap md:flex-nowrap">
              <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                <SelectTrigger className="bg-black/40 border-white/10 h-12 rounded-xl w-[160px]">
                  <SelectValue placeholder="All Semesters">
                    {semesterFilter !== 'all' ? formatSemester(semesterFilter) : 'All Semesters'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="glass-heavy border-white/10 rounded-xl">
                  <SelectItem value="all">All Semesters</SelectItem>
                  {[1,2,3,4,5,6,7,8].map(s => (
                    <SelectItem key={s} value={`${s}th Semester`}>
                      {formatSemester(`${s}th Semester`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
                <SelectTrigger className="bg-black/40 border-white/10 h-12 rounded-xl w-[160px]">
                  <SelectValue placeholder="Exam Type" />
                </SelectTrigger>
                <SelectContent className="glass-heavy border-white/10 rounded-xl">
                  <SelectItem value="all">All Exams</SelectItem>
                  <SelectItem value="Mid-Semester">Mid-Semester</SelectItem>
                  <SelectItem value="End-Semester">End-Semester</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="bg-black/40 border-white/10 h-12 rounded-xl w-[140px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="glass-heavy border-white/10 rounded-xl">
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map(y => <SelectItem key={y as string} value={y as string}>{y as string}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </FadeIn>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Skeleton key={i} className="h-48 rounded-3xl glass-heavy" />
          ))}
        </div>
      ) : filteredPapers.length === 0 ? (
        <FadeIn delay={0.3}>
          <div className="text-center py-20 glass rounded-3xl border border-white/5">
            <FileText size={48} className="mx-auto text-muted-foreground/30 mb-4" strokeWidth={1} />
            <h3 className="text-xl font-light text-white">No papers found</h3>
            <p className="text-muted-foreground font-light mt-2">Try adjusting your search or filters.</p>
          </div>
        </FadeIn>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper, idx) => (
            <FadeIn key={paper.id} delay={0.1 * (idx % 10)}>
              <HoverCard className="glass p-6 rounded-3xl h-full flex flex-col border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="text-[10px] font-mono tracking-wider border-primary/30 text-primary bg-primary/10 rounded-full px-3 py-1">
                    {paper.subject_code}
                  </Badge>
                  <div className="text-[10px] text-muted-foreground">{new Date(paper.created_at).toLocaleDateString()}</div>
                </div>
                
                <h3 className="text-xl font-medium mb-4 flex-1 text-white">{paper.subject_name}</h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="glass bg-white/5 font-normal hover:bg-white/10 text-muted-foreground">{formatSemester(paper.semester)}</Badge>
                  <Badge variant="secondary" className="glass bg-white/5 font-normal hover:bg-white/10 text-muted-foreground">{paper.year}</Badge>
                  <Badge variant="secondary" className="glass bg-white/5 font-normal hover:bg-white/10 text-muted-foreground">{paper.exam_type}</Badge>
                </div>
                
                <Button 
                  onClick={() => handleDownload(paper.id, paper.file_url)}
                  variant="outline"
                  className="w-full rounded-xl h-12 border-white/10 hover:bg-white/10 hover:text-white transition-all font-medium"
                  disabled={downloadingId === paper.id}
                >
                  {downloadingId === paper.id ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> Preparing...</>
                  ) : (
                    <><Download size={16} className="mr-2" /> Download PDF</>
                  )}
                </Button>
              </HoverCard>
            </FadeIn>
          ))}
        </div>
      )}
    </PageTransition>
  )
}
