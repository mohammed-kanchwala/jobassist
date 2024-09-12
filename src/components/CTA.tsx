import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function CTA () {
    return (
        <>
        {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Find Your Dream Job?</h2>
          <p className="text-xl mb-8 text-white">Join thousands of job seekers who have found success with JobRight</p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white text-gray-800 px-4 py-2 rounded-full w-full md:w-64"
            />
            <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full transition-transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </section>
        </>
    )
}