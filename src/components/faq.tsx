import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export default function FAQ() {
    const [openFaqIndex, setOpenFaqIndex] = useState(0)
    const faqs = [
        {
          question: "Will Landingear share my personal information?",
          answer: "No, Landingear takes privacy seriously. Your personal information is never shared with third parties without your consent. It's only used within the platform to provide AI-driven job matching, resume customization, and other personalized services."
        },
        {
          question: "How is Landingear different from platforms like LinkedIn?",
          answer: "Unlike LinkedIn and Indeed, where you're navigating the job search alone, Landingear.ai serves as your companion throughout the process. Think of it as having a personal career coach by your side, guiding you toward your next dream job. Landingear streamlines the entire job search process with built-in automation, saving you hours and providing a more efficient and customized experience."
        },
        {
          question: "Is Landingear free to use?",
          answer: "Yes, Landingear is currently free for all users. Our goal is to give everyone equal access to better job search tools, including our AI resume editor and intelligent job matches. In the future, we may offer premium services for users seeking additional support in their career journey."
        },
        {
          question: "Where do Landingear's job listings come from?",
          answer: "Landingear aggregates listings from the career pages of thousands of companies, ensuring access to a wide range of opportunities. We also pull the latest job postings from major platforms, so you don't need to visit multiple sites. All new listings are carefully screened to remove fake jobs, providing a reliable and trustworthy job search experience."
        },
        {
          question: "What regions does Landingear's service cover?",
          answer: "Currently, our primary focus is the United States. We also support job searches that include H1B visa options and remote work. As we expand into more regions, we will keep our users updated."
        }
      ]
    return(
        <>
        {/* FAQ Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">We Got You Covered</h2>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-primary leading-tight mb-6">
                  FREQUENTLY<br />ASKED<br />QUESTIONS
                </h3>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-card rounded-lg shadow-md overflow-hidden">
                    <button
                      className="w-full text-left p-6 focus:outline-none"
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-card-foreground">{faq.question}</h4>
                        {openFaqIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-6 pb-6">
                        <p className="text-card-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                Have more questions? Feel free to reach out to us at{' '}
                <a href="mailto:support@landingear.ai" className="text-primary hover:underline">
                  support@landingear.ai
                </a>
                . We're excited to have you on this journey with us!
              </p>
            </div>
          </div>
        </section>
      </>
    )
}