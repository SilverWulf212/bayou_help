import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Trash2 } from 'lucide-react'

function Privacy() {
  return (
    <div className="min-h-screen bg-bayou-cream">
      <header className="bg-bayou-green text-white py-3 px-4 flex items-center gap-4">
        <Link to="/" className="hover:opacity-80">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-lg font-bold">Your Privacy</h1>
          <p className="text-xs text-bayou-cream/80">How we protect you</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <section className="bg-white rounded-lg p-6 border border-border mb-6">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-bayou-green flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-bayou-green mb-2">
                Your Safety Comes First
              </h2>
              <p className="text-muted-foreground">
                We built Bayou Help with your privacy and safety in mind.
                Here's what that means for you.
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
                  No Data Saved
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your chat messages are not stored. When you close the page,
                  everything you typed is gone. We don't track what you search for.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-border">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-bayou-blue mt-0.5" />
              <div>
                <h3 className="font-semibold text-bayou-green mb-1">
                  Quick Exit Button
                </h3>
                <p className="text-sm text-muted-foreground">
                  See the X button in the bottom corner? Click it to instantly
                  leave this site and go to Google. Use it if someone walks in
                  and you need to hide what you're looking at.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-border">
            <h3 className="font-semibold text-bayou-green mb-2">
              Browser Safety Tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Use incognito/private mode for extra privacy</li>
              <li>• Clear your browser history when done</li>
              <li>• Use a library computer if your device isn't safe</li>
            </ul>
          </div>
        </div>

        <section className="mt-8 bg-bayou-green/10 rounded-lg p-6">
          <h3 className="font-semibold text-bayou-green mb-3">
            Crisis Resources
          </h3>
          <div className="space-y-3 text-sm">
            <p>
              <strong>National Suicide Prevention:</strong>{' '}
              <a href="tel:988" className="text-bayou-blue underline">988</a>
            </p>
            <p>
              <strong>National Domestic Violence Hotline:</strong>{' '}
              <a href="tel:1-800-799-7233" className="text-bayou-blue underline">
                1-800-799-7233
              </a>
            </p>
            <p>
              <strong>Faith House (Acadiana DV):</strong>{' '}
              <a href="tel:337-232-8954" className="text-bayou-blue underline">
                337-232-8954
              </a>
            </p>
            <p>
              <strong>Emergency:</strong>{' '}
              <a href="tel:911" className="text-bayou-blue underline">911</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Privacy
