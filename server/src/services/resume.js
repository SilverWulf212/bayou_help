// Resume Builder Service
// Guides users through creating a simple resume via chat

import PDFDocument from 'pdfkit'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export const RESUME_PROMPT = `You are now helping someone build a simple resume. Guide them step by step.

RESUME BUILDING PROCESS:
Ask ONE question at a time in this order:
1. "What's your full name?"
2. "What's a phone number where employers can reach you?"
3. "What city do you live in?"
4. "What kind of work are you looking for?" (e.g., warehouse, retail, food service, cleaning)
5. "Have you worked before? Tell me about your most recent job - what was the job title and company name?"
6. "What did you do at that job? Give me 2-3 things you did."
7. "Do you have any other jobs to add, or should we move on?" (repeat 5-6 if yes)
8. "What skills do you have?" (e.g., can drive, speak Spanish, good with customers, lift heavy things)

RULES:
- Ask ONE question at a time
- Use simple, friendly language
- If they don't know something, help them think of answers
- Be encouraging - everyone has skills!
- When you have enough info (name, phone, city, job type, at least 1 job or skill), say "I have enough to make your resume! Type 'make my resume' when ready."

EXAMPLE CONVERSATION:
User: "I need help with my resume"
You: "I'd be happy to help you build a resume! Let's start simple. What's your full name?"
User: "John Smith"
You: "Great, John! What's a phone number where employers can reach you?"
...and so on.

Remember: Many people haven't made a resume before. Be patient and helpful.`

export function detectResumeIntent(message) {
  const lower = message.toLowerCase()
  const resumeKeywords = [
    'resume', 'résumé', 'cv', 'build resume', 'make resume',
    'need resume', 'help with resume', 'create resume', 'write resume',
    'job application', 'apply for job'
  ]
  return resumeKeywords.some(k => lower.includes(k))
}

export function detectResumeComplete(message) {
  const lower = message.toLowerCase()
  return lower.includes('make my resume') ||
         lower.includes('create my resume') ||
         lower.includes('generate resume') ||
         lower.includes('finish resume') ||
         lower.includes('done with resume')
}

export function isInResumeMode(history) {
  // Check if we're already in resume building mode by looking at history
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i]
    if (msg.role === 'assistant' && msg.resumeMode) {
      return true
    }
    // If we find a completed resume, we're no longer in resume mode
    if (msg.role === 'assistant' && msg.resumeComplete) {
      return false
    }
  }
  return false
}

export function extractResumeData(history) {
  // Extract resume info from conversation history
  const data = {
    name: '',
    phone: '',
    city: '',
    jobType: '',
    jobs: [],
    skills: []
  }

  // Find where resume mode started
  let resumeStartIndex = -1
  for (let i = 0; i < history.length; i++) {
    const msg = history[i]
    if (msg.role === 'user') {
      const lower = msg.content.toLowerCase()
      if (lower.includes('resume') || lower.includes('cv')) {
        resumeStartIndex = i
        break
      }
    }
  }

  if (resumeStartIndex === -1) return data

  // Extract data from user responses after resume mode started
  let questionIndex = 0
  const questionOrder = ['name', 'phone', 'city', 'jobType', 'job', 'duties', 'skills']

  for (let i = resumeStartIndex + 1; i < history.length; i++) {
    const msg = history[i]

    if (msg.role === 'assistant') {
      const lower = msg.content.toLowerCase()
      // Detect what question was asked to track progress
      if (lower.includes('name')) questionIndex = 0
      else if (lower.includes('phone')) questionIndex = 1
      else if (lower.includes('city') || lower.includes('live')) questionIndex = 2
      else if (lower.includes('kind of work') || lower.includes('looking for') || lower.includes('type of')) questionIndex = 3
      else if (lower.includes('worked') || lower.includes('job') || lower.includes('recent')) questionIndex = 4
      else if (lower.includes('did you do') || lower.includes('responsibilit') || lower.includes('duties')) questionIndex = 5
      else if (lower.includes('skill')) questionIndex = 6
    } else if (msg.role === 'user') {
      const content = msg.content.trim()
      // Skip if this is the "make my resume" command
      if (detectResumeComplete(content)) continue

      switch (questionOrder[questionIndex]) {
        case 'name':
          if (!data.name) data.name = content
          questionIndex++
          break
        case 'phone':
          if (!data.phone) data.phone = content
          questionIndex++
          break
        case 'city':
          if (!data.city) data.city = content
          questionIndex++
          break
        case 'jobType':
          if (!data.jobType) data.jobType = content
          questionIndex++
          break
        case 'job':
          data.jobs.push({ title: content, duties: [] })
          questionIndex++
          break
        case 'duties':
          if (data.jobs.length > 0) {
            data.jobs[data.jobs.length - 1].duties = content.split(/[,\n]/).map(d => d.trim()).filter(d => d)
          }
          questionIndex++
          break
        case 'skills':
          data.skills = content.split(/[,\n]/).map(s => s.trim()).filter(s => s)
          break
      }
    }
  }

  return data
}

export function generateResumeText(data) {
  let resume = `
═══════════════════════════════════════
            ${data.name.toUpperCase() || 'YOUR NAME'}
═══════════════════════════════════════
Phone: ${data.phone || '(your phone)'}
Location: ${data.city || '(your city)'}, Louisiana

───────────────────────────────────────
OBJECTIVE
───────────────────────────────────────
Seeking ${data.jobType || 'employment'} position where I can
contribute my skills and grow professionally.

`

  if (data.jobs.length > 0) {
    resume += `───────────────────────────────────────
WORK EXPERIENCE
───────────────────────────────────────
`
    for (const job of data.jobs) {
      resume += `${job.title}\n`
      if (job.duties.length > 0) {
        for (const duty of job.duties) {
          resume += `  • ${duty}\n`
        }
      }
      resume += '\n'
    }
  }

  if (data.skills.length > 0) {
    resume += `───────────────────────────────────────
SKILLS
───────────────────────────────────────
`
    for (const skill of data.skills) {
      resume += `  • ${skill}\n`
    }
  }

  resume += `
═══════════════════════════════════════
`

  return resume.trim()
}

export function generateResumeHTML(data) {
  const jobsHtml = data.jobs.map(job => `
    <div class="job">
      <strong>${job.title}</strong>
      ${job.duties.length > 0 ? `<ul>${job.duties.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('')

  const skillsHtml = data.skills.length > 0
    ? `<ul>${data.skills.map(s => `<li>${s}</li>`).join('')}</ul>`
    : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
    h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
    .contact { text-align: center; margin-bottom: 20px; }
    h2 { color: #2d5a27; border-bottom: 1px solid #ccc; }
    ul { margin: 10px 0; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>${data.name || 'Your Name'}</h1>
  <div class="contact">
    ${data.phone || '(phone)'} | ${data.city || '(city)'}, Louisiana
  </div>

  <h2>Objective</h2>
  <p>Seeking ${data.jobType || 'employment'} position where I can contribute my skills and grow professionally.</p>

  ${data.jobs.length > 0 ? `<h2>Work Experience</h2>${jobsHtml}` : ''}
  ${data.skills.length > 0 ? `<h2>Skills</h2>${skillsHtml}` : ''}
</body>
</html>
`
}

export function generateResumePDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      const chunks = []

      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Header - Name
      doc.fontSize(24).font('Helvetica-Bold')
         .text(data.name || 'Your Name', { align: 'center' })

      // Contact info
      doc.fontSize(11).font('Helvetica')
         .text(`${data.phone || '(phone)'} | ${data.city || '(city)'}, Louisiana`, { align: 'center' })

      doc.moveDown(1.5)

      // Objective
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#2d5a27')
         .text('OBJECTIVE')
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#cccccc')
      doc.moveDown(0.5)
      doc.fontSize(11).font('Helvetica').fillColor('black')
         .text(`Seeking ${data.jobType || 'employment'} position where I can contribute my skills and grow professionally.`)

      doc.moveDown(1)

      // Work Experience
      if (data.jobs && data.jobs.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#2d5a27')
           .text('WORK EXPERIENCE')
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#cccccc')
        doc.moveDown(0.5)

        for (const job of data.jobs) {
          doc.fontSize(12).font('Helvetica-Bold').fillColor('black')
             .text(job.title)
          if (job.duties && job.duties.length > 0) {
            for (const duty of job.duties) {
              doc.fontSize(11).font('Helvetica')
                 .text(`  •  ${duty}`)
            }
          }
          doc.moveDown(0.5)
        }
      }

      // Skills
      if (data.skills && data.skills.length > 0) {
        doc.moveDown(0.5)
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#2d5a27')
           .text('SKILLS')
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#cccccc')
        doc.moveDown(0.5)

        for (const skill of data.skills) {
          doc.fontSize(11).font('Helvetica').fillColor('black')
             .text(`  •  ${skill}`)
        }
      }

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

export async function generateResumeDOCX(data) {
  const children = []

  // Name header
  children.push(
    new Paragraph({
      children: [new TextRun({ text: data.name || 'Your Name', bold: true, size: 48 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    })
  )

  // Contact info
  children.push(
    new Paragraph({
      children: [new TextRun({ text: `${data.phone || '(phone)'} | ${data.city || '(city)'}, Louisiana`, size: 22 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  )

  // Objective
  children.push(
    new Paragraph({
      text: 'OBJECTIVE',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 }
    })
  )
  children.push(
    new Paragraph({
      children: [new TextRun({ text: `Seeking ${data.jobType || 'employment'} position where I can contribute my skills and grow professionally.`, size: 22 })],
      spacing: { after: 200 }
    })
  )

  // Work Experience
  if (data.jobs && data.jobs.length > 0) {
    children.push(
      new Paragraph({
        text: 'WORK EXPERIENCE',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    )

    for (const job of data.jobs) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: job.title, bold: true, size: 24 })],
          spacing: { before: 100 }
        })
      )
      if (job.duties && job.duties.length > 0) {
        for (const duty of job.duties) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `•  ${duty}`, size: 22 })],
              indent: { left: 360 }
            })
          )
        }
      }
    }
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    children.push(
      new Paragraph({
        text: 'SKILLS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    )

    for (const skill of data.skills) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `•  ${skill}`, size: 22 })],
          indent: { left: 360 }
        })
      )
    }
  }

  const doc = new Document({
    sections: [{ children }]
  })

  return await Packer.toBuffer(doc)
}
