import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Simon Pious",
    role: "AVP Marketing",
    image: "/simon.jpeg",
    text: "Landingear helped me find my dream job in just a week! The AI recommendations were spot-on.",
  },
  {
    name: "Suraj Sharma",
    role: "Sales leader",
    image: "/Suraj.jpeg",
    text: "Landingear helped me land my dream job in just a week! The AI suggestions were incredibly accurate.",
  },
  {
    name: "Simon Pious",
    role: "AVP Marketing",
    image: "/simon.jpeg",
    text: "Landingear made my job search effortless! The tailored AI suggestions led me to the perfect role faster than I imagined."
  },
  {
    name: "Suraj Sharma",
    role: "Sales leader",
    image: "/Suraj.jpeg",
    text: "I couldn't believe how quickly Landingear matched me with opportunities that aligned with my skills and experience—it's a game changer!",
  },
  {
    name: "Simon Pious",
    role: "AVP Marketing",
    image: "/simon.jpeg",
    text: "With Landingear's precise recommendations, I found the ideal job in no time. It saved me hours of searching and brought me the perfect fit!",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">What Our Users Say</h2>
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex space-x-6 animate-scroll">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-md w-80 flex-shrink-0 transform transition-all hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <img src={`${testimonial.image}?height=50&width=50`} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-card-foreground truncate">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-card-foreground mb-4 line-clamp-3">{testimonial.text}</p>
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}