import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Trash2 } from 'lucide-react'

function Privacy() {
  return (
    <div className="min-h-screen hero-backdrop">
      <header className="bg-bayou-green text-white py-3 px-4 flex items-center gap-4">
        <Link to="/" className="hover:opacity-80">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-lg font-bold">Privacy</h1>
          <p className="text-xs text-bayou-cream/80">How we protect you</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <section className="bg-white rounded-lg p-6 border border-border mb-6">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-bayou-green flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-bayou-green mb-2">
                Your safety comes first
              </h2>
              <p className="text-muted-foreground">
                Bayou Help is designed for privacy and safety.
                Here’s what that means.
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-5 border border-border">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-bayou-blue mt-0.5" />
              <div>
                <h3 className="font-semibold text-bayou-green mb-1">
                  No chat history saved
                </h3>
                <p className="text-sm text-muted-foreground">
                  We don’t store your chat messages. When you refresh or close the page,
                  this chat disappears. We don’t ask for your name.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-border">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-bayou-blue mt-0.5" />
              <div>
                <h3 className="font-semibold text-bayou-green mb-1">
                  Quick exit button                </h3>
                <p className="text-sm text-muted-foreground">
                  See the X button in the corner? Tap it to leave this site instantly.
                  It will open Google.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-border">
            <h3 className="font-semibold text-bayou-green mb-2">
              Browser safety tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Use a private/incognito window</li>
              <li>• Clear your browser history when you’re done</li>
              <li>• If your phone isn’t safe, use a trusted device (like at a library)</li>
            </ul>
          </div>
        </div>

        <section className="mt-8 bg-bayou-green/10 rounded-lg p-6">
          <h3 className="font-semibold text-bayou-green mb-3">
            Need help right now?
          </h3>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Suicide & Crisis Lifeline:</strong>{' '}
              <a href="tel:988" className="text-bayou-blue underline">Call or text 988</a>
            </p>
            <p>
              <strong>National Domestic Violence Hotline:</strong>{' '}
              <a href="tel:1-800-799-7233" className="text-bayou-blue underline">
                Call 1-800-799-7233
              </a>
            </p>
            <p>
              <strong>Faith House (Acadiana):</strong>{' '}
              <a href="tel:337-232-8954" className="text-bayou-blue underline">
                Call 337-232-8954
              </a>
            </p>
            <p>
              <strong>Emergency:</strong>{' '}
              <a href="tel:911" className="text-bayou-blue underline">Call 911</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Privacy
