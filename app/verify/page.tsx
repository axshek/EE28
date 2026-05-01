import { MailCheck } from 'lucide-react'
import Link from 'next/link'

export default function VerifyPage() {
  return (
    <main className="page-wrapper flex items-center justify-center">
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="glass-card animate-fade-in text-center" style={{ padding: '3rem' }}>
          <div className="flex justify-center mb-6">
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
              <MailCheck color="var(--tu-gold)" size={48} />
            </div>
          </div>
          
          <h1 className="text-2xl mb-4">Check Your Email</h1>
          <p className="text-muted mb-6">
            We've sent a verification link to your university email address. 
            Please click the link in the email to activate your account.
          </p>
          
          <div className="p-4 bg-slate-900 rounded-lg mb-6 text-sm text-left border border-slate-800">
            <span className="text-tu-gold font-medium">Note:</span> If you don't see the email within a few minutes, check your spam or junk folder.
          </div>

          <Link href="/login" className="btn btn-outline w-full">
            Return to Login
          </Link>
        </div>
      </div>
    </main>
  )
}
