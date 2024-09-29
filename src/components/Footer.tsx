export default function Footer() {
    return (
      <>
      {/* Footer */}
      <footer className="bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">JobRight</h3>
              <p className="text-primary">AI-powered job search platform</p>
            </div>
            {['Company', 'Resources', 'Legal'].map((category, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-4 text-foreground">{category}</h3>
                <ul className="space-y-2">
                  {['About', 'Careers', 'Contact'].map((item, idx) => (
                    <li key={idx}>
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-muted text-center text-muted-foreground">
            <p>&copy; 2023 JobRight. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </>
    )
  }