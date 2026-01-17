import { Link } from 'react-router-dom'
import { MessageCircle, MapPin, Shield } from 'lucide-react'

function Landing() {
  return (
    <div className="min-h-screen bg-bayou-cream">
      <header className="bg-bayou-green text-white py-4 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Bayou Help</h1>
          <p className="text-bayou-cream/80 text-sm">Acadiana Community Resources</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-bayou-green mb-4">
            Find Help in Acadiana
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Free, private help finding shelter, food, healthcare, and other
            resources in Lafayette and surrounding parishes.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto mb-12">
          <Link
            to="/chat"
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border"
          >
            <MessageCircle className="w-12 h-12 text-bayou-blue mb-4" />
            <h3 className="text-xl font-semibold text-bayou-green mb-2">Chat for Help</h3>
            <p className="text-center text-muted-foreground text-sm">
              Tell us what you need and we'll help you find local resources
            </p>
          </Link>

          <Link
            to="/resources"
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border"
          >
            <MapPin className="w-12 h-12 text-bayou-blue mb-4" />
            <h3 className="text-xl font-semibold text-bayou-green mb-2">Browse Resources</h3>
            <p className="text-center text-muted-foreground text-sm">
              Search shelters, food pantries, clinics, and more by parish
            </p>
          </Link>

          <Link
            to="/privacy"
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border"
          >
            <Shield className="w-12 h-12 text-bayou-blue mb-4" />
            <h3 className="text-xl font-semibold text-bayou-green mb-2">Your Privacy</h3>
            <p className="text-center text-muted-foreground text-sm">
              Learn how we protect your information and keep you safe
            </p>
          </Link>
        </section>

        <section className="bg-white rounded-lg p-6 max-w-2xl mx-auto border border-border">
          <h3 className="text-lg font-semibold text-bayou-green mb-4">
            Quick Help
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/resources?category=shelter"
              className="px-4 py-3 bg-bayou-cream rounded-md text-bayou-green hover:bg-bayou-green hover:text-white transition-colors text-center"
            >
              I need a place to stay
            </Link>
            <Link
              to="/resources?category=food"
              className="px-4 py-3 bg-bayou-cream rounded-md text-bayou-green hover:bg-bayou-green hover:text-white transition-colors text-center"
            >
              I need food
            </Link>
            <Link
              to="/resources?category=health"
              className="px-4 py-3 bg-bayou-cream rounded-md text-bayou-green hover:bg-bayou-green hover:text-white transition-colors text-center"
            >
              I need medical help
            </Link>
            <Link
              to="/resources?category=crisis"
              className="px-4 py-3 bg-bayou-cream rounded-md text-bayou-green hover:bg-bayou-green hover:text-white transition-colors text-center"
            >
              I'm in crisis
            </Link>
          </div>
        </section>

        <section className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Emergency?</strong> Call 911 |
            <strong> Crisis?</strong> Call 988 (Suicide & Crisis Lifeline)
          </p>
        </section>
      </main>
    </div>
  )
}

export default Landing
