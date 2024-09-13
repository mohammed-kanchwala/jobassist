import { Star } from "lucide-react"

export default function Testimonials () {
    return (
        <>
          {/* Testimonial Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">What Our Users Say</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
                    <div className="flex items-center mb-4">
                      <img src={`/placeholder.svg?height=50&width=50`} alt="User" className="w-12 h-12 rounded-full mr-4" />
                      <div>
                        <p className="font-semibold text-gray-800">John Doe</p>
                        <p className="text-sm text-gray-600">Software Engineer</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">"JobAssist helped me find my dream job in just a week! The AI recommendations were spot-on."</p>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
    )
}