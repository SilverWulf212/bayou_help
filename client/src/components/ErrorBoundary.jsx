import { Component } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <h1 className="text-2xl font-semibold text-foreground mb-3">
              Something went wrong
            </h1>

            <p className="text-muted-foreground mb-6">
              We're sorry, but something unexpected happened. You can try again or return home.
              If you need immediate help, call <strong>211</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 bg-bayou-green text-white hover:bg-bayou-green/90 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try again
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 bg-white border border-border hover:bg-muted transition-colors"
              >
                <Home className="w-4 h-4" />
                Return home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
