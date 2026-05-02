'use client'

import { useState, useRef } from 'react'
import { uploadPaper } from '@/app/actions/papers'
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'
import { PageTransition, FadeIn } from '@/components/animations/PageTransition'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatSemester } from '@/lib/utils'

export default function UploadPaperPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [dragActive, setDragActive] = useState(false)
  
  const [subjectName, setSubjectName] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [semester, setSemester] = useState('1th Semester')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [examType, setExamType] = useState('Mid-Semester')
  const [file, setFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await uploadPaper(formData)
      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else if (result?.success) {
        setMessage({ type: 'success', text: 'Question paper uploaded successfully!' })
        
        setSubjectName('')
        setSubjectCode('')
        setSemester('1th Semester')
        setYear(new Date().getFullYear().toString())
        setExamType('Mid-Semester')
        setFile(null)

        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="max-w-3xl mx-auto py-8">
      <FadeIn delay={0.1}>
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">Upload Paper</h1>
          <p className="text-muted-foreground font-light text-lg">Add a new past paper to the archive.</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="glass-heavy rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-10">
            {message && (
              <div className={`mb-8 p-4 rounded-2xl flex items-start gap-3 border ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-destructive/10 border-destructive/20 text-destructive'
              } animate-in fade-in slide-in-from-top-4`}>
                {message.type === 'success' ? <CheckCircle2 size={20} className="mt-0.5" /> : <AlertCircle size={20} className="mt-0.5" />}
                <p className="font-medium text-sm">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="subject_name" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Subject Name</Label>
                  <Input id="subject_name" name="subject_name" type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="bg-black/40 border-white/10 focus-visible:ring-accent h-12 rounded-xl px-4 transition-all" placeholder="e.g. Basic Electrical Engineering" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject_code" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Subject Code</Label>
                  <Input id="subject_code" name="subject_code" type="text" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} className="bg-black/40 border-white/10 focus-visible:ring-accent h-12 rounded-xl px-4 transition-all font-mono" placeholder="e.g. EE101" required />
                </div>
                
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="semester" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Semester</Label>
                  <Select name="semester" value={semester} onValueChange={setSemester} required>
                    <SelectTrigger className="bg-black/40 border-white/10 focus:ring-accent h-12 rounded-xl px-4 transition-all">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent className="glass-heavy border-white/10 rounded-xl">
                      {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={`${s}th Semester`}>{formatSemester(`${s}th Semester`)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="year" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Year</Label>
                  <Select name="year" value={year} onValueChange={setYear} required>
                    <SelectTrigger className="bg-black/40 border-white/10 focus:ring-accent h-12 rounded-xl px-4 transition-all">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent className="glass-heavy border-white/10 rounded-xl">
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 flex flex-col md:col-span-2">
                  <Label htmlFor="exam_type" className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Exam Type</Label>
                  <Select name="exam_type" value={examType} onValueChange={setExamType} required>
                    <SelectTrigger className="bg-black/40 border-white/10 focus:ring-accent h-12 rounded-xl px-4 transition-all">
                      <SelectValue placeholder="Select Exam Type" />
                    </SelectTrigger>
                    <SelectContent className="glass-heavy border-white/10 rounded-xl">
                      <SelectItem value="Mid-Semester">Mid-Semester</SelectItem>
                      <SelectItem value="End-Semester">End-Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div 
                className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                  dragActive ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDrop={() => setDragActive(false)}
              >
                <UploadCloud size={48} className={`mx-auto mb-6 transition-colors duration-300 ${dragActive ? 'text-accent' : 'text-muted-foreground/50'}`} strokeWidth={1} />
                <Label htmlFor="file" className="block text-lg font-medium text-white mb-2 cursor-pointer">
                  Drag & Drop PDF or Click to Browse
                </Label>
                <p className="text-muted-foreground font-light text-sm mb-6">Maximum file size: 10MB</p>
                <Input 
                  id="file" 
                  name="file" 
                  type="file" 
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required 
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_14px_0_rgba(255,214,10,0.2)]" disabled={loading}>
                  {loading ? 'Uploading...' : 'Upload Paper'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  )
}
