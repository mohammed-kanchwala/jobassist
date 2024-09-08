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
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  redirect("/JobListing");
};

export const signOutSupabase = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  redirect("/JobListing");
};