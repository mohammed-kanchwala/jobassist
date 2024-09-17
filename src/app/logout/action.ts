'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function logout() {
  console.log('logout called')
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/')
  }
  revalidatePath('/', 'layout')
  redirect('/')
}
