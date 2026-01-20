import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

export const RESUME_PROMPT = `You are a friendly resume assistant for Bayou Help, helping job seekers in Acadiana, Louisiana.

RESUME BUILDING PROCESS - Ask ONE question at a time:
1. "What's your full name?"
2. "What's a phone number where employers can reach you?"
3. "What's your email address? (or say 'skip' if you don't have one)"
4. "What city do you live in?"
5. "What kind of work are you looking for?" (warehouse, retail, food service, healthcare, etc.)
6. "Tell me about your most recent job - what was your job title and where did you work?"
7. "What did you do at that job? Give me 2-3 main things."
8. "Any other jobs to add? Say 'no' to move on, or tell me about another job."
9. "What skills do you have?" (driving, customer service, computers, languages, certifications, etc.)
10. "Any education to include? High school, GED, trade school, college, certifications?"

RULES:
- Ask ONE question at a time
- Use simple, friendly language (6th grade reading level)
- Be encouraging - everyone has valuable skills!
- If they say "skip" or "none", move to the next question
- When you have: name, phone, city, at least 1 job OR 3 skills, say:
  "Great! I have enough info. Click the 'Create My Resume' button when you're ready!"

Be patient and helpful. Many people haven't made a resume before.`

const RESUME_FORMAT_PROMPT = `You are a professional resume writer. Take the provided information and create a clean, professional resume.

RULES:
1. Write professionally but simply
2. Use action verbs (managed, created, helped, trained, etc.)
3. Fix grammar and spelling
4. Don't invent information - only use what's provided
5. If something is missing, skip that section

OUTPUT FORMAT (use this exact structure):
NAME: [Full Name]
EMAIL: [Email or "Not provided"]
PHONE: [Phone]
LOCATION: [City, State]

SUMMARY:
[2-3 sentence professional summary based on their experience and goals]

EXPERIENCE:
[Job Title] | [Company] | [Location]
- [Responsibility/achievement]
- [Responsibility/achievement]

EDUCATION:
[Degree/Certificate] | [School] | [Year if provided]

SKILLS:
[Skill 1], [Skill 2], [Skill 3], etc.`

const TRIAGE_PROMPT = `You determine if someone needs local resources or job/resume help.

Respond with ONLY one word:
- RESOURCES = needs shelter, food, healthcare, crisis help, transportation, documents, immediate assistance
- RESUME = wants help with resume, job search, employment, career, work application

PRIORITY: If someone mentions BOTH immediate needs (food, shelter, danger) AND jobs, respond RESOURCES.

Examples:
"I need food" → RESOURCES
"help with my resume" → RESUME
"looking for work" → RESUME
"I'm homeless and need a job" → RESOURCES
"can you help me find a job" → RESUME
"I'm hungry" → RESOURCES`

export async function triageUser(message) {
  if (!OPENAI_API_KEY) {
    const lower = message.toLowerCase()
    const resumeWords = ['resume', 'job', 'work', 'employ', 'career', 'cv', 'application']
    if (resumeWords.some(w => lower.includes(w))) {
      return { route: 'RESUME' }
    }
    return { route: 'RESOURCES' }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: TRIAGE_PROMPT },
          { role: 'user', content: message }
        ],
        max_tokens: 10,
        temperature: 0
      })
    })

    const data = await response.json()
    const result = data.choices?.[0]?.message?.content?.trim().toUpperCase()
    return { route: result === 'RESUME' ? 'RESUME' : 'RESOURCES' }
  } catch (error) {
    console.error('Triage error:', error.message)
    return { route: 'RESOURCES' }
  }
}

export async function generateResumeChat(message, history) {
  if (!OPENAI_API_KEY) {
    return { content: "I'd love to help with your resume, but the AI service isn't available right now. Please try again later or visit the Louisiana Workforce Commission at 337-262-5679 for in-person help." }
  }

  const messages = [
    { role: 'system', content: RESUME_PROMPT },
    ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message }
  ]

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        max_tokens: 300,
        temperature: 0.7
      })
    })

    const data = await response.json()
    return { content: data.choices?.[0]?.message?.content || "I'm having trouble. Let's try that again." }
  } catch (error) {
    console.error('Resume chat error:', error.message)
    return { content: "Something went wrong. Please try again." }
  }
}

export async function formatResumeWithAI(userInfo) {
  if (!OPENAI_API_KEY) {
    throw new Error('Resume formatting requires AI service')
  }

  const prompt = `Create a professional resume with this information:

Name: ${userInfo.name || 'Not provided'}
Email: ${userInfo.email || 'Not provided'}
Phone: ${userInfo.phone || 'Not provided'}
Location: ${userInfo.location || 'Louisiana'}

Work Experience:
${userInfo.experience || 'None provided'}

Education:
${userInfo.education || 'None provided'}

Skills:
${userInfo.skills || 'None provided'}

Job Goal: ${userInfo.jobGoal || 'General employment'}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: RESUME_FORMAT_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.3
    })
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

function parseResumeText(text) {
  const result = {
    name: '', email: '', phone: '', location: '',
    summary: '', experience: [], education: [], skills: []
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  let section = null

  for (const line of lines) {
    if (line.startsWith('NAME:')) result.name = line.replace('NAME:', '').trim()
    else if (line.startsWith('EMAIL:')) result.email = line.replace('EMAIL:', '').trim()
    else if (line.startsWith('PHONE:')) result.phone = line.replace('PHONE:', '').trim()
    else if (line.startsWith('LOCATION:')) result.location = line.replace('LOCATION:', '').trim()
    else if (line.startsWith('SUMMARY:')) {
      section = 'summary'
      const s = line.replace('SUMMARY:', '').trim()
      if (s) result.summary = s
    }
    else if (line.startsWith('EXPERIENCE:')) section = 'experience'
    else if (line.startsWith('EDUCATION:')) section = 'education'
    else if (line.startsWith('SKILLS:')) {
      section = 'skills'
      const s = line.replace('SKILLS:', '').trim()
      if (s) result.skills = s.split(',').map(x => x.trim()).filter(Boolean)
    }
    else if (section === 'summary') result.summary += ' ' + line
    else if (section === 'experience') result.experience.push(line)
    else if (section === 'education') result.education.push(line)
    else if (section === 'skills' && !result.skills.length) {
      result.skills = line.split(',').map(x => x.trim()).filter(Boolean)
    }
  }

  return result
}

export async function generateResumeDOCX(userInfo) {
  const formattedText = await formatResumeWithAI(userInfo)
  const parsed = parseResumeText(formattedText)

  const children = []

  // Name
  if (parsed.name && parsed.name !== 'Not provided') {
    children.push(new Paragraph({
      children: [new TextRun({ text: parsed.name, bold: true, size: 48 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }))
  }

  // Contact
  const contact = [parsed.email, parsed.phone, parsed.location]
    .filter(x => x && x !== 'Not provided').join(' | ')
  if (contact) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contact, size: 22 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }))
  }

  // Summary
  if (parsed.summary) {
    children.push(new Paragraph({
      text: 'PROFESSIONAL SUMMARY',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 }
    }))
    children.push(new Paragraph({
      children: [new TextRun({ text: parsed.summary.trim(), size: 22 })],
      spacing: { after: 200 }
    }))
  }

  // Experience
  if (parsed.experience.length) {
    children.push(new Paragraph({
      text: 'WORK EXPERIENCE',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 }
    }))
    for (const line of parsed.experience) {
      const isBullet = line.startsWith('-')
      children.push(new Paragraph({
        children: [new TextRun({
          text: isBullet ? line.substring(1).trim() : line,
          size: 22,
          bold: !isBullet
        })],
        bullet: isBullet ? { level: 0 } : undefined,
        spacing: { after: 50 }
      }))
    }
  }

  // Education
  if (parsed.education.length) {
    children.push(new Paragraph({
      text: 'EDUCATION',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 }
    }))
    for (const line of parsed.education) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.replace(/^-\s*/, ''), size: 22 })],
        spacing: { after: 50 }
      }))
    }
  }

  // Skills
  if (parsed.skills.length) {
    children.push(new Paragraph({
      text: 'SKILLS',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 }
    }))
    children.push(new Paragraph({
      children: [new TextRun({ text: parsed.skills.join(' • '), size: 22 })],
      spacing: { after: 100 }
    }))
  }

  const doc = new Document({ sections: [{ children }] })
  const buffer = await Packer.toBuffer(doc)

  return { buffer, text: formattedText, parsed }
}
