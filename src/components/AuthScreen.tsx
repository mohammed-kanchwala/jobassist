'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { FcGoogle } from 'react-icons/fc'
import { signIn, useSession, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInSupabase, signUpSupabase } from '../lib/auth';
import { supabase } from '../lib/supabaseClient';

interface AuthScreenProps {
  onClose: () => void;
}

export default function AuthScreen({ onClose }: AuthScreenProps) {
    const { data: session, status } = useSession()
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()
    const [isSignUp, setIsSignUp] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: '',
    })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && status === 'authenticated' && session) {
      onClose()
      router.push('/')
    }
  }, [isMounted, status, session, onClose, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (isSignUp && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        if (isSignUp) {
          await signUpSupabase(formData.fullName, formData.email, formData.password);
        } else {
          await signInSupabase(formData.email, formData.password);
        }
        router.push('/JobListing')
      } catch (error) {
        console.error('Error during sign-in:', error);
        setErrors({ email: 'Invalid email or password' });
      }
      }
    };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', { callbackUrl: 'https://rnmpfnjnvykncgwjecql.supabase.co/auth/v1/callback' });
      await addUserDetails();
      if (result?.error) {
        console.error('Error during Google sign-in:', result.error);
        setErrors({ email: 'Error while signing in with Google' });
      }
    } catch (error) {
      console.error('Unexpected error during Google sign-in:', error);
      setErrors({ email: 'Error while signing in with Google' });
    }
  };

const addUserDetails = async () => {
  const session = await getSession();
  if (session?.user) {
    const names = session.user.name?.split(' ') || ['', ''];
    const { data, error } = await supabase.from('users').upsert({
      first_name: names[0],
      last_name: names.slice(1).join(' '),
      email: session.user.email,
      profile_picture: session.user.image,
    }, {
      onConflict: 'user_id',
    });
    if (error) {
      console.error('Error adding user details to DB', error);
    } else {
      console.log('User details added to DB', data);
    }
  }
};
  if (!isMounted) {
    return null // or a loading indicator
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <Card className="w-full max-w-md bg-background text-white">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <button onClick={onClose} className="text-primary hover:text-white">
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:text-white"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
          
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </CardTitle>

          <CardDescription className="text-primary mt-2">
            {isSignUp ? 'Create your account to get started' : 'Welcome back! Please enter your details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="bg-[#0A2A40] border-primary text-white placeholder-primary"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
            )}
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                className="bg-[#0A2A40] border-primary text-white placeholder-primary"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                className="bg-[#0A2A40] border-primary text-white placeholder-primary"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full bg-primary text-background hover:bg-[#5FFFC1]">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-between">
            <hr className="w-full border-t border-primary" />
            <span className="px-2 text-primary">or</span>
            <hr className="w-full border-t border-primary" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full border-primary text-white hover:bg-[#0A2A40]"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            {isSignUp ? 'Sign up' : 'Sign in'} with Google
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}