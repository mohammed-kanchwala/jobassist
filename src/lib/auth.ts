import {NextAuthOptions, User, getServerSession} from "next-auth"
import {useSession} from "next-auth/react"
import {redirect} from "next/navigation"
import CredentialsProvider from "next-auth/providers/credentials"
import GoolgleProvider from "next-auth/providers/google"
import { supabase } from './supabaseClient';

export const authConfig :NextAuthOptions = ({
    providers: [
        GoolgleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ]
})


export const signInSupabase = async (email : string, password : string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  redirect("/JobListing");
};

export const signUpSupabase = async (fullname : string, email : string, password : string) => {
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const names = fullname.split(' ') || ['', ''];
  const first_name = names[0];
  const last_name = names.slice(1).join(' ');
  const { error } = await supabase.auth.signUp({ email, password });
  const { data, error: userError } = await supabase.from('users').upsert({
    first_name,
    last_name,
    email,
    password: password,
    profile_picture: '',
  });

  if (error) throw error;
  redirect("/JobListing");
};

export const signOutSupabase = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  redirect("/JobListing");
};