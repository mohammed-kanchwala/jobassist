import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Menu, X, Mail, Lock } from "lucide-react"
import Link from 'next/link'
import { login, signup } from '../app/login/action'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

  if (authMode === 'signin') {
    console.log("login step")
    login(email, password); 
  } else {
    signup(email, password);
  }
    console.log(`${authMode} submitted`)
    setIsModalOpen(false)
  }

  return (
    <>
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-600">JobAssist</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Home</Link>
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Features</Link>
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Pricing</Link>
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Contact</Link>
          </nav>
          <div className="hidden md:flex space-x-4">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-100" onClick={() => setAuthMode('signin')}>
                  Log In
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => setAuthMode('signup')}>
                  Sign Up
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
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
                  <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-purple-700">
                    {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                      className="ml-1 text-purple-600 hover:underline"
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
              {isMenuOpen ? <X className="text-gray-600" /> : <Menu className="text-gray-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 fixed top-16 left-0 right-0 z-40 shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Home</Link>
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Features</Link>
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Pricing</Link>
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Contact</Link>
            <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-100" onClick={() => { setAuthMode('signin'); setIsModalOpen(true);  }}>
              Log In
            </Button>
            <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => { setAuthMode('signup'); setIsModalOpen(true);  }}>
              Sign Up
            </Button>
          </nav>
        </div>
      )}
    </>
  )
}