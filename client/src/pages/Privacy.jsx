import { Shield, Eye, Trash2 } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import ScrollFadeIn from '../components/ui/ScrollFadeIn'

function Privacy() {
  return (
    <div className="min-h-screen bg-bayou-cream">
      <PageHero
        title="Privacy"
        subtitle="How we protect you"
        imageSrc="/2026-01-17 17-02-56.webp"
        imageAlt="Hope Haven reading area"
        height="160px"
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl hero-backdrop">
        <ScrollFadeIn delay={0}>
          <section className="bg-white rounded-lg p-6 border border-border mb-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-bayou-green flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-bayou-green mb-2">
                  Your safety comes first
                </h2>
                <p className="text-muted-foreground">
                  Bayou Help is designed for privacy and safety.
                  Here's what that means.
                </p>
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        <div className="space-y-4">
          <ScrollFadeIn delay={100}>
            <div className="bg-white rounded-lg p-5 border border-border">
              <div className="flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-bayou-blue mt-0.5" />
                <div>
                  <h3 className="font-semibold text-bayou-green mb-1">
                    No chat history saved
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We don't store your chat messages. When you refresh or close the page,
                    this chat disappears. We don't ask for your name.
                  </p>
                </div>
              </div>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={200}>
            <div className="bg-white rounded-lg p-5 border border-border">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-bayou-blue mt-0.5" />
                <div>
                  <h3 className="font-semibold text-bayou-green mb-1">
                    Quick exit button
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    See the X button in the corner? Tap it to leave this site instantly.
                    It will open Google.
                  </p>
                </div>
              </div>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={300}>
            <div className="bg-white rounded-lg p-5 border border-border">
              <h3 className="font-semibold text-bayou-green mb-2">
                Browser safety tips
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Use a private/incognito window</li>
                <li>Clear your browser history when you're done</li>
                <li>If your phone isn't safe, use a trusted device (like at a library)</li>
              </ul>
            </div>
          </ScrollFadeIn>
        </div>

        <ScrollFadeIn delay={400}>
          <section
            className="mt-8 rounded-lg p-6 relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(16, 38, 28, 0.85), rgba(16, 38, 28, 0.9)), url("/2026-01-17 17-07-00.webp")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h3 className="font-semibold text-white mb-3">
              Need help right now?
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-white/90">
                <strong className="text-white">Suicide & Crisis Lifeline:</strong>{' '}
                <a href="tel:988" className="text-bayou-gold underline hover:text-white">
                  Call or text 988
                </a>
              </p>
              <p className="text-white/90">
                <strong className="text-white">National Domestic Violence Hotline:</strong>{' '}
                <a href="tel:1-800-799-7233" className="text-bayou-gold underline hover:text-white">
                  Call 1-800-799-7233
                </a>
              </p>
              <p className="text-white/90">
                <strong className="text-white">Faith House (Acadiana):</strong>{' '}
                <a href="tel:337-232-8954" className="text-bayou-gold underline hover:text-white">
                  Call 337-232-8954
                </a>
              </p>
              <p className="text-white/90">
                <strong className="text-white">Emergency:</strong>{' '}
                <a href="tel:911" className="text-bayou-gold underline hover:text-white">
                  Call 911
                </a>
              </p>
            </div>
          </section>
        </ScrollFadeIn>
      </main>
    </div>
  )
}

export default Privacy
