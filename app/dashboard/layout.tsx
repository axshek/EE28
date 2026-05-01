import StudentSidebar from '@/components/StudentSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen pt-[80px]">
      <StudentSidebar />
      <main style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  )
}
