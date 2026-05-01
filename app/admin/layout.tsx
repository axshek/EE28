import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen pt-[80px]">
      <AdminSidebar />
      <main style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  )
}
