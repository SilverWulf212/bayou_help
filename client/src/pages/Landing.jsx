import { Link } from 'react-router-dom'
import { ArrowRight, Heart, MessageCircle, MapPin, Shield } from 'lucide-react'

function Landing() {
  return (
    <div className="min-h-screen hero-backdrop">
      <header className="px-4 pt-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="soft-fade-in">
            <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
              Acadiana Community Support
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-bayou-green">
              Bayou Help
            </h1>
          </div>

          <div className="flex items-center gap-2 soft-fade-in">
            <Link
              to="/privacy"
              className="rounded-full px-4 py-2 text-sm bg-white/70 border border-border hover:bg-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/admin"
              className="rounded-full px-4 py-2 text-sm bg-white/70 border border-border hover:bg-white transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12 pt-8">
        <section className="grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7">
            <div className="hero-glass rounded-3xl border border-border p-6 sm:p-10 soft-rise-in">
              <div className="flex items-center gap-2 text-bayou-green/90">
                <Heart className="w-4 h-4" />
                <p className="text-sm">A calm place to start.</p>
              </div>

              <h2 className="mt-4 text-4xl sm:text-5xl leading-[1.05] font-semibold text-[hsl(var(--hero-ink))]">
                Find help for shelter, food,
                <span className="block">health, and more.</span>
              </h2>

              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl">
                We’ll help you find local resources in Acadiana. No judgment. Start with a chat
                or browse the list.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/chat"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 bg-bayou-green text-white shadow-sm hover:bg-bayou-green/90 transition-colors"
                >
                  Start chat
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to="/resources"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 bg-white/70 border border-border hover:bg-white transition-colors"
                >
                  Browse resources
                  <MapPin className="w-4 h-4 text-bayou-blue" />

                </Link>
              </div>

              <div className="mt-7 rounded-2xl bg-white/60 border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  <strong>In danger or medical emergency?</strong> Call 911.
                  <span className="mx-1">|</span>
                  <strong>Need to talk to someone right now?</strong> Call or text 988.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <Link
              to="/chat"
              className="block hero-glass rounded-3xl border border-border p-5 sm:p-6 soft-rise-in stagger-1 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-bayou-blue/15 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-bayou-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-bayou-green">Chat for help</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tell us what you need. We'll suggest local resources.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/resources"
              className="block hero-glass rounded-3xl border border-border p-5 sm:p-6 soft-rise-in stagger-2 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-bayou-green/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-bayou-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-bayou-green">Browse by parish</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Shelters, food pantries, clinics, transportation, and more.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/privacy"
              className="block hero-glass rounded-3xl border border-border p-5 sm:p-6 soft-rise-in stagger-3 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-bayou-gold/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-bayou-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-bayou-green">Your privacy</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    How we keep your information safe.
                  </p>
                </div>
              </div>
            </Link>

            <section className="rounded-3xl border border-border bg-white/60 p-5 sm:p-6">
              <h3 className="text-sm tracking-[0.18em] uppercase text-muted-foreground">
                Quick paths
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/resources?category=shelter"
                  className="rounded-2xl px-4 py-3 bg-white/70 border border-border hover:bg-white transition-colors text-center text-sm"
                >
                  Shelter
                </Link>
                <Link
                  to="/resources?category=food"
                  className="rounded-2xl px-4 py-3 bg-white/70 border border-border hover:bg-white transition-colors text-center text-sm"
                >
                  Food
                </Link>
                <Link
                  to="/resources?category=health"
                  className="rounded-2xl px-4 py-3 bg-white/70 border border-border hover:bg-white transition-colors text-center text-sm"
                >
                  Medical
                </Link>
                <Link
                  to="/resources?category=crisis"
                  className="rounded-2xl px-4 py-3 bg-white/70 border border-border hover:bg-white transition-colors text-center text-sm"
                >
                  Crisis
                </Link>
              </div>
            </section>
          </div>
        </section>

        <footer className="mt-10 pb-4 text-center">
          <p className="text-xs text-muted-foreground">
            For privacy, avoid sharing names or account numbers. Resource details can change—call to confirm.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default Landing
