'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function login(email: string, password: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  console.log('login'+data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/jobs')
}

export async function signup(email: string, password: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: 'http://localhost:3001/profile',
    },
    
  })
  
  console.log('sign up'+data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}