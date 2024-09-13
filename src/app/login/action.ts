'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(email: string, password: string) {
  const supabase = createClient()

  console.log("calling supabase login")
  const data = {
    email: email,
    password: password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log("Error while user login")
    return redirect('/')
  }

  revalidatePath('/', 'layout')
  redirect('/jobs')
}

export async function signup(email: string, password: string) {
  const supabase = createClient()
  const data = {
    email: email,
    password: password,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/jobs')
}