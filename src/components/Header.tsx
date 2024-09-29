import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Menu, X, Mail, Lock } from "lucide-react"
import Link from 'next/link'
import { login, signup } from '../app/login/action'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

    if (authMode === 'signin') {
      console.log('login from headers')
      login(email, password); 
    } else {
      console.log('signup from headers')
      signup(email, password);
    }

    
    console.log(`${authMode} submitted`)
    setIsModalOpen(false)
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-background shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Landingear</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">Pricing</Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">Contact</Link>
          </nav>
          <div className="hidden md:flex space-x-4 items-center">
            <ThemeToggle />
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-primary border-primary hover:bg-secondary" onClick={() => setAuthMode('signin')}>
                  Log In
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setAuthMode('signup')}>
                  Sign Up
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-background text-white">
                <DialogHeader>
                  <DialogTitle>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input id="email" type="email" placeholder="Enter your email" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input id="password" type="password" placeholder="Enter your password" className="pl-10" required />
                    </div>
                  </div>
                  {authMode === 'signup' && (
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input id="confirm-password" type="password" placeholder="Confirm your password" className="pl-10" required />
                      </div>
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-primary text-background hover:bg-background hover:text-primary">
                    {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-primary">
                    {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                      className="ml-1 text-white hover:underline"
                    >
                      {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="text-primary" /> : <Menu className="text-primary" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background p-4 fixed top-16 left-0 right-0 z-40 shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link href="#" className="text-white hover:text-primary transition-colors">Home</Link>
            <Link href="#" className="text-white hover:text-primary transition-colors">Features</Link>
            <Link href="#" className="text-white hover:text-primary transition-colors">Pricing</Link>
            <Link href="#" className="text-white hover:text-primary transition-colors">Contact</Link>
            <Button variant="outline" className="text-primary border-primary hover:bg-[#0A2A40]" onClick={() => { setAuthMode('signin'); setIsModalOpen(true);  }}>
              Log In
            </Button>
            <Button className="bg-primary text-background hover:bg-[#5FFFC1]" onClick={() => { setAuthMode('signup'); setIsModalOpen(true);  }}>
              Sign Up
            </Button>
          </nav>
        </div>
      )}
    </>
  )
}