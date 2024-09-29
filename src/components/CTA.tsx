import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function CTA () {
    return (
        <>
        {/* CTA Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Job?</h2>
              <p className="text-xl mb-8">Join thousands of job seekers who have found success with JobRight</p>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full md:w-64"
                />
                <Button className="w-full md:w-auto">
                  Get Started
                </Button>
              </div>
            </div>
          </section>
        </>
    )
}