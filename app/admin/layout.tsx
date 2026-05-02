import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen pt-[80px]">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-[260px] p-4 sm:p-6 lg:p-8 min-w-0">
        {children}
      </main>
    </div>
  )
}
