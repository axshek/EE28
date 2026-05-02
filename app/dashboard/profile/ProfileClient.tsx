'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Hash, Book, Pencil, Check, X, ExternalLink } from 'lucide-react'
import { PageTransition, FadeIn, HoverCard } from '@/components/animations/PageTransition'
import { Badge } from '@/components/ui/badge'
import { formatSemester } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProfileClient({ initialProfile, user }: { initialProfile: any, user: any }) {
  const [profile, setProfile] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [rollNumber, setRollNumber] = useState(profile?.roll_number || '')
  const [semester, setSemester] = useState(profile?.semester || '')
  const [linkedin, setLinkedin] = useState(profile?.linkedin || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClient()

  const handleSave = async () => {
    setError('')
    if (!rollNumber.trim()) {
      setError('Roll number cannot be empty')
      return
    }
    if (!semester) {
      setError('Semester must be selected')
      return
    }

    setIsSaving(true)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        roll_number: rollNumber,
        semester: semester,
        linkedin: linkedin
      })
      .eq('id', user.id)

    setIsSaving(false)

    if (updateError) {
      setError('Failed to update profile. Please try again.')
    } else {
      setProfile({ ...profile, roll_number: rollNumber, semester: semester, linkedin: linkedin })
      setIsEditing(false)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  const handleCancel = () => {
    setRollNumber(profile?.roll_number || '')
    setSemester(profile?.semester || '')
    setLinkedin(profile?.linkedin || '')
    setIsEditing(false)
    setError('')
  }

  return (
    <PageTransition className="max-w-2xl mx-auto py-8">
      <FadeIn delay={0.1}>
        <div className="mb-10 text-center relative">
          {success && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {success}
            </div>
          )}
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 mx-auto flex items-center justify-center border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] mb-6">
            <User size={40} className="text-white" strokeWidth={1.5} />
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-4xl font-light tracking-tight text-white">{profile?.full_name}</h1>
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(true)}
                className="rounded-full hover:bg-white/10 text-muted-foreground hover:text-white"
                title="Edit Profile"
              >
                <Pencil size={18} />
              </Button>
            )}
          </div>
          
          <Badge variant="outline" className="text-[10px] font-mono tracking-widest uppercase border-primary/30 text-primary bg-primary/10 rounded-full px-4 py-1.5">
            {profile?.role === 'admin' ? 'Admin' : 'Student'}
          </Badge>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="glass-heavy rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-white">Account Details</h2>
              {isEditing && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving} className="text-muted-foreground hover:text-white">
                    <X size={16} className="mr-1" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white">
                    <Check size={16} className="mr-1" /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <HoverCard className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">University Email</div>
                  <div className="font-medium text-white">{user?.email}</div>
                </div>
              </HoverCard>
              
              <HoverCard className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                  <Hash size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Roll Number</div>
                  {isEditing ? (
                    <Input 
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="bg-black/40 border-white/10 text-white h-10 mt-1"
                      placeholder="e.g. EEB24021"
                    />
                  ) : (
                    <div className="font-medium text-white">{profile?.roll_number}</div>
                  )}
                </div>
              </HoverCard>

              <HoverCard className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                  <Book size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Current Semester</div>
                  {isEditing ? (
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger className="bg-black/40 border-white/10 text-white h-10 mt-1 w-full">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#0f1117]">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                          <SelectItem key={s} value={`${s}th Semester`}>
                            {formatSemester(`${s}th Semester`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="font-medium text-white">{profile?.semester ? formatSemester(profile?.semester) : ''}</div>
                  )}
                </div>
              </HoverCard>

              <HoverCard className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                  <ExternalLink size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">LinkedIn Profile</div>
                  {isEditing ? (
                    <Input 
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      type="url"
                      className="bg-black/40 border-white/10 text-white h-10 mt-1"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  ) : profile?.linkedin ? (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors text-sm cursor-pointer">
                      <ExternalLink size={13} />
                      View Profile
                    </a>
                  ) : (
                    <span className="text-muted-foreground/50 text-sm">Not added</span>
                  )}
                </div>
              </HoverCard>
            </div>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  )
}
