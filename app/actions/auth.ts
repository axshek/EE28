'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function adminLogin(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Step 1: Sign in first
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    return { error: error.message }
  }

  // Step 2: Check role from database (source of truth)
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single()

  // Step 3: If not admin, sign out and deny access
  if (profile?.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: "Access denied. You are not an authorized administrator." }
  }

  // Step 4: Redirect to admin dashboard
  redirect('/admin/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const fullName = formData.get('fullName') as string
  const rollNumber = formData.get('rollNumber') as string
  const semester = formData.get('semester') as string

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }

  if (!email.endsWith('@tezu.ac.in')) {
    return { error: "Only Tezpur University email addresses (@tezu.ac.in) are allowed." }
  }

  const data = {
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        roll_number: rollNumber,
        semester: semester,
        role: 'student'
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  redirect('/verify')
}
