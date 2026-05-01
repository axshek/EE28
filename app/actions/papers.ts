'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function uploadPaper(formData: FormData) {
  const supabase = await createClient()

  // Verify Admin Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: "Unauthorized. Admin only." }

  const file = formData.get('file') as File
  const subject_name = formData.get('subject_name') as string
  const subject_code = formData.get('subject_code') as string
  const semester = formData.get('semester') as string
  const year = formData.get('year') as string
  const exam_type = formData.get('exam_type') as string

  if (!file || !subject_name || !subject_code || !semester || !year || !exam_type) {
    return { error: "All fields are required" }
  }

  // Generate unique file name
  const fileExt = file.name.split('.').pop()
  const fileName = `${subject_code}_${year}_${exam_type}_${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  // Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from('question_papers')
    .upload(filePath, file)

  if (uploadError) {
    return { error: "Failed to upload file: " + uploadError.message }
  }

  // Insert Record to Database
  const { error: dbError } = await supabase.from('question_papers').insert({
    subject_name,
    subject_code,
    semester,
    year,
    exam_type,
    file_url: filePath
  })

  if (dbError) {
    // Attempt to clean up file if db insert fails
    await supabase.storage.from('question_papers').remove([filePath])
    return { error: "Failed to save record: " + dbError.message }
  }

  revalidatePath('/admin/papers/manage')
  revalidatePath('/dashboard/papers')
  
  return { success: true }
}

export async function deletePaper(id: string, file_url: string) {
  const supabase = await createClient()
  
  // Verify Admin Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: "Unauthorized. Admin only." }

  // Delete from DB
  const { error: dbError } = await supabase.from('question_papers').delete().eq('id', id)
  if (dbError) return { error: "Failed to delete record: " + dbError.message }

  // Delete from Storage
  const { error: storageError } = await supabase.storage.from('question_papers').remove([file_url])
  if (storageError) return { error: "Failed to delete file from storage: " + storageError.message }

  revalidatePath('/admin/papers/manage')
  revalidatePath('/dashboard/papers')
  
  return { success: true }
}

export async function getSignedUrl(filePath: string) {
  const supabase = await createClient()
  
  // Create a signed URL valid for 60 seconds (1 minute)
  const { data, error } = await supabase.storage
    .from('question_papers')
    .createSignedUrl(filePath, 60)
    
  if (error) return { error: error.message }
  return { url: data.signedUrl }
}
