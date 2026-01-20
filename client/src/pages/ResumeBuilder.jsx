import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Download, ArrowLeft, Send, Briefcase } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import ScrollFadeIn from '../components/ui/ScrollFadeIn'

function ResumeBuilder() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTriage, setShowTriage] = useState(true)
  const [triageInput, setTriageInput] = useState('')
  const [canGenerate, setCanGenerate] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const lastAssistant = messages.filter(m => m.role === 'assistant').pop()
    if (lastAssistant?.content?.toLowerCase().includes('create my resume')) {
      setCanGenerate(true)
    }
  }, [messages])

  const handleTriage = async (e) => {
    e.preventDefault()
    if (!triageInput.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/resume/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: triageInput })
      })
      const data = await response.json()

      if (data.route === 'RESOURCES') {
        navigate('/chat', { state: { initialMessage: triageInput } })
      } else {
        setShowTriage(false)
        sendMessage("I need help with my resume")
      }
    } catch (error) {
      console.error('Triage error:', error)
      setShowTriage(false)
      sendMessage("I need help with my resume")
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (content) => {
    const userMessage = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/resume/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: newMessages
        })
      })
      const data = await response.json()
      setMessages([...newMessages, { role: 'assistant', content: data.content }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages([...newMessages, {
        role: 'assistant',
        content: "Sorry, I'm having trouble. Please try again."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage(input.trim())
    setInput('')
  }

  const extractResumeInfo = () => {
    const info = {
      name: '', email: '', phone: '', location: '',
      experience: '', education: '', skills: '', jobGoal: ''
    }

    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content)

    for (let i = 0; i < userMessages.length; i++) {
      const msg = userMessages[i]
      const prevAssistant = messages.filter(m => m.role === 'assistant')[i - 1]?.content?.toLowerCase() || ''

      if (prevAssistant.includes('name') && !info.name) {
        info.name = msg
      } else if (prevAssistant.includes('phone') && !info.phone) {
        info.phone = msg
      } else if (prevAssistant.includes('email') && !info.email && msg.toLowerCase() !== 'skip') {
        info.email = msg
      } else if ((prevAssistant.includes('city') || prevAssistant.includes('live')) && !info.location) {
        info.location = msg
      } else if ((prevAssistant.includes('kind of work') || prevAssistant.includes('looking for')) && !info.jobGoal) {
        info.jobGoal = msg
      } else if ((prevAssistant.includes('job') || prevAssistant.includes('work')) && prevAssistant.includes('title')) {
        info.experience += msg + '\n'
      } else if (prevAssistant.includes('did') && prevAssistant.includes('job')) {
        info.experience += msg + '\n'
      } else if (prevAssistant.includes('skill')) {
        info.skills = msg
      } else if (prevAssistant.includes('education')) {
        info.education = msg
      }
    }

    const allUserText = userMessages.join('\n')
    return {
      ...info,
      experience: info.experience || allUserText,
      rawConversation: allUserText
    }
  }

  const handleGenerateResume = async () => {
    setIsGenerating(true)
    try {
      const userInfo = extractResumeInfo()

      const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInfo })
      })

      if (!response.ok) throw new Error('Generation failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'my-resume.docx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Your resume has been downloaded! Open it in Word or Google Docs to make any final edits. Good luck with your job search!"
      }])
    } catch (error) {
      console.error('Generate error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't create the document. Please try again."
      }])
    } finally {
      setIsGenerating(false)
    }
  }

  if (showTriage) {
    return (
      <div className="min-h-screen bg-bayou-cream">
        <PageHero
          title="How Can We Help?"
          subtitle="Jobs • Resources • Support"
          imageSrc="/2026-01-17 17-07-00.webp"
          imageAlt="Community support"
          height="160px"
        />

        <main className="container mx-auto px-4 py-8 hero-backdrop">
          <ScrollFadeIn>
            <div className="max-w-xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-bayou-blue/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-bayou-blue" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-bayou-green">Tell us what you need</h2>
                    <p className="text-sm text-muted-foreground">
                      We'll point you in the right direction
                    </p>
                  </div>
                </div>

                <form onSubmit={handleTriage} className="space-y-4">
                  <textarea
                    value={triageInput}
                    onChange={(e) => setTriageInput(e.target.value)}
                    placeholder="Example: I need help making a resume for warehouse jobs"
                    className="w-full px-4 py-3 border border-input rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-bayou-blue/20"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !triageInput.trim()}
                    className="w-full bg-bayou-green text-white py-3 rounded-xl hover:bg-bayou-green/90 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Checking...' : 'Continue'}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">Or jump directly to:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowTriage(false); sendMessage("I need help with my resume") }}
                      className="flex-1 px-4 py-2 bg-bayou-blue/10 text-bayou-blue rounded-lg text-sm hover:bg-bayou-blue/20"
                    >
                      Resume Help
                    </button>
                    <button
                      onClick={() => navigate('/chat')}
                      className="flex-1 px-4 py-2 bg-bayou-green/10 text-bayou-green rounded-lg text-sm hover:bg-bayou-green/20"
                    >
                      Local Resources
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-bayou-cream">
      <PageHero
        title="Resume Builder"
        subtitle="Let's create your resume"
        imageSrc="/2026-01-17 17-07-00.webp"
        imageAlt="Job preparation"
        height="120px"
      />

      <div className="bg-white border-b border-border px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-bayou-green"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {canGenerate && (
          <button
            onClick={handleGenerateResume}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-bayou-green text-white px-4 py-2 rounded-lg text-sm hover:bg-bayou-green/90 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Creating...' : 'Create My Resume'}
          </button>
        )}
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 hero-backdrop">
        {messages.length === 0 && (
          <div className="bg-white rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-bayou-blue" />
              <span className="font-medium text-bayou-green">Resume Assistant</span>
            </div>
            <p className="text-sm text-muted-foreground">
              I'll ask you a few questions to build your resume. Answer as best you can -
              we'll make it look professional!
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 ${
              message.role === 'user'
                ? 'bg-bayou-blue/10 ml-8'
                : 'bg-white border border-border mr-8'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}

        {isLoading && (
          <div className="bg-white rounded-lg p-4 border border-border mr-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-bayou-blue rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-bayou-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-bayou-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1 px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-bayou-blue/20"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-bayou-green text-white rounded-xl hover:bg-bayou-green/90 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ResumeBuilder
