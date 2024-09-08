'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Menu, X, User, BookmarkIcon, LogOut } from "lucide-react"
import Image from 'next/image'

interface HeaderProps {
  onGetStarted?: () => void;
  user?: {
    name: string;
    image: string;
  };
  onLogout?: () => void;
}

export default function Header({ onGetStarted, user, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const headerBackground = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['rgba(13, 13, 13, 0)', 'rgba(13, 13, 13, 0.8)']
  )

  return (
    <>
      <motion.header
        style={{ backgroundColor: headerBackground }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-6"
      >
        <nav className="container mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold">JobAssist</div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a>
            {user ? (
              <>
                <a href="/saved-jobs" className="text-gray-300 hover:text-white">Saved Jobs</a>
                <a href="/my-account" className="text-gray-300 hover:text-white">My Account</a>
              </>
            ) : (
              <a href="#" className="text-gray-300 hover:text-white">About</a>
            )}
          </div>
          {user ? (
            <div className="flex items-center space-x-4">
              <Image src={user.image} alt={user.name} width={32} height={32} className="rounded-full" />
              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="bg-transparent text-white border-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white"
              onClick={onGetStarted}
            >
              Get Started
            </Button>
          )}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </motion.header>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-0 right-0 bg-[#0d0d0d] z-40 p-4 md:hidden"
        >
          <div className="flex flex-col space-y-4">
            <a href="#features" className="text-gray-300 hover:text-white">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a>
            {user ? (
              <>
                <a href="/saved-jobs" className="text-gray-300 hover:text-white">Saved Jobs</a>
                <a href="/my-account" className="text-gray-300 hover:text-white">My Account</a>
                <Button variant="outline" className="bg-transparent text-white border-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white" onClick={onLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <a href="#" className="text-gray-300 hover:text-white">About</a>
                <Button variant="outline" className="bg-transparent text-white border-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white" onClick={onGetStarted}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </>
  )
}