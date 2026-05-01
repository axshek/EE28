'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Users as UsersIcon, ShieldAlert, GraduationCap } from 'lucide-react'
import { PageTransition, FadeIn } from '@/components/animations/PageTransition'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (data) {
      setUsers(data)
    }
    setLoading(false)
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.roll_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageTransition>
      <div className="mb-10 flex justify-between items-end flex-wrap gap-6">
        <FadeIn delay={0.1}>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">Manage Users</h1>
          <p className="text-muted-foreground font-light text-lg">View registered students and administrators.</p>
        </FadeIn>
        
        <FadeIn delay={0.2} className="w-full md:w-auto md:min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
            <Input 
              type="text" 
              placeholder="Search by name or roll no..." 
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
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <UsersIcon size={48} className="mx-auto text-muted-foreground/30 mb-4" strokeWidth={1} />
              <h3 className="text-xl font-light text-white">No users found</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-muted-foreground bg-white/[0.02]">
                    <th className="py-5 px-6 font-semibold">User</th>
                    <th className="py-5 px-6 font-semibold">Roll Number</th>
                    <th className="py-5 px-6 font-semibold">Semester</th>
                    <th className="py-5 px-6 font-semibold">Role</th>
                    <th className="py-5 px-6 font-semibold">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light">
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx === filteredUsers.length - 1 ? 'border-none' : ''}`}>
                      <td className="py-5 px-6 text-white font-medium flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                          {user.role === 'admin' ? <ShieldAlert size={18} className="text-destructive" /> : <GraduationCap size={18} className="text-primary" />}
                        </div>
                        {user.full_name || 'N/A'}
                      </td>
                      <td className="py-5 px-6">
                        <span className="font-mono text-muted-foreground">{user.roll_number || '-'}</span>
                      </td>
                      <td className="py-5 px-6 text-muted-foreground">{user.semester || '-'}</td>
                      <td className="py-5 px-6">
                        <Badge variant="outline" className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-semibold border-transparent ${
                          user.role === 'admin' 
                            ? 'bg-destructive/10 text-destructive border-destructive/20' 
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {user.role || 'STUDENT'}
                        </Badge>
                      </td>
                      <td className="py-5 px-6 text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</td>
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
