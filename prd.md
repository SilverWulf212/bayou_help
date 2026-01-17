```

PRODUCT REQUIREMENTS DOCUMENT (PRD) + LLM DEPLOYMENT SPECIFICATION



================================================================================

SECTION 1: CONTEXT \& PRODUCT VISION

================================================================================



\*\*Product Name Options (Acadiana cultural alignment)\*\*

1\. 

2\. \*\*Bayou Help\*\*





\*\*Product Vision Statement\*\*

A free, public web app that offers quick, simple help to people facing homelessness in Acadiana—using local resources, short guidance, and AI grounded in real data.



\*\*Target Users\*\*

\- People experiencing homelessness or unstable housing in Acadiana (South Louisiana)

\- Accessing via mobile phone, shelter kiosk, or low-bandwidth network



\*\*Core Use Cases\*\*

\- Managing money, even without income

\- Finding nearby food, shelters, and services

\- Keeping track of appointments

\- Searching for work and building simple resumes

\- Making daily life decisions with support



\*\*Non-Overridable Constraint\*\*

All responses are written at a ~6th-grade reading level using short, clear language.



================================================================================

SECTION 2: NON-OVERRIDABLE LLM BEHAVIOR CONSTRAINTS

================================================================================



\*\*RESPONSE STYLE RULES\*\*

\- Reading Level: ~6th grade

\- Max Length: 6 short sentences \*OR\* 8 bullet points

\- Tone: Calm, respectful, and practical

\- Format: Prefer checklists; no long paragraphs

\- Follow-up Questions: At most 1, only when critical

\- Assume stress, fatigue, and mobile access



\*\*RESOURCE PRESENTATION FORMAT\*\*

\- Resource Name

\- What it offers

\- Basic eligibility

\- City/area served

\- Hours

\- Phone/contact

\- Clear “what to do next” step



\*\*SAFETY \& ESCALATION\*\*

\- Not a substitute for professional help

\- Must escalate if signs of:

&nbsp; - Suicide/self-harm

&nbsp; - Domestic violence

&nbsp; - Human trafficking

&nbsp; - Medical/mental health emergency

\- “Quick Exit” button required in UI

\- Data retention: None. Logs: minimal.



\*\*FAILURE \& UNCERTAINTY HANDLING\*\*

\- Never guess or invent resources

\- Clearly say when info is missing

\- Offer safe fallback steps



================================================================================

SECTION 3: PRODUCT REQUIREMENTS DOCUMENT (PRD)

================================================================================



\### A. Goals, Non-Goals, Assumptions, Constraints



\*\*Goals\*\*

\- Provide instant, useful help to users in distress

\- Connect users with verified local services

\- Be usable on any mobile device under stress



\*\*Non-Goals\*\*

\- Deep case management

\- Long-form education or job coaching

\- Real-time chat with human agents



\*\*Assumptions\*\*

\- Users may be unsheltered or in temporary housing

\- Users have limited or unstable internet access

\- Users may have low reading skills and high stress



\*\*Constraints\*\*

\- All responses must follow literacy and tone rules

\- Must function offline (in degraded state) when possible

\- App must store no user data



---examples of use:



\### B. Personas (Acadiana-Specific)



\*\*1. Kenny, 38 – Unsheltered, Lafayette\*\*

\- Recently laid off, sleeps outdoors or in shelters

\- Needs food, resume help, transportation



\*\*2. Maria, 24 – Couchsurfing, Abbeville\*\*

\- Escaped domestic abuse

\- Needs privacy, legal help, trauma care



\*\*3. Ms. Lottie, 63 – Elderly, Opelousas\*\*

\- Evicted, has minor health issues

\- Looking for shelter, help getting IDs, Medicare



---



\### C. User Journeys



\*\*1. Kenny wants to find shelter tonight\*\*

\- Opens app → Sees “Find Shelter” → Filters for Lafayette → Finds St. Joseph Shelter → Calls number



\*\*2. Maria lost her ID and needs a new one\*\*

\- Taps “Replace ID” → Steps listed with what to bring → Nearest DMV location + free ride option listed



\*\*3. Ms. Lottie needs to find food\*\*

\- Opens app → “Find Food” → Filters by city → Sees lunch hours at local food pantry



\*\*4. Kenny wants to apply for a job\*\*

\- “Job Help” → Picks “Make a resume” → AI creates simple 1-page resume → Option to print or email



\*\*5. Maria in crisis wants a safe place\*\*

\- Enters “I’m not safe” → Redirected to domestic abuse hotline → Safe shelter list shown



---



\### D. Feature List



\*\*Must-Have\*\*

\- AI chat assistant (Phi-4)

\- RAG search with local resource data

\- Location-aware filtering (parish/city)

\- Resource Finder UI

\- Quick exit/privacy button

\- Offline/error modes

\- Mobile-first layout

\- Admin panel for uploading resources



\*\*Should-Have\*\*

\- Resume builder (basic template)

\- Appointment tracker (non-authenticated)

\- Print/email PDF generator

\- Simple budgeting tool (with $0 income mode)



\*\*Could-Have\*\*

\- SMS fallback support

\- Anonymous session notes (temporary memory only)

\- Kiosk mode with pre-set cities



---



\### E. Core User Stories \& Acceptance Criteria



\*\*1. As a user, I want to find a nearby food pantry.\*\*

\- ✅ Filters by parish or current location

\- ✅ Shows open hours and contact

\- ✅ “What to do next” shown clearly



\*\*2. As a user, I want to get help with no money.\*\*

\- ✅ Shows budgeting tool with $0 option

\- ✅ Prompts next actions I can take

\- ✅ No account or signup required



\*\*3. As a user, I want help making a resume.\*\*

\- ✅ Asks 3–5 short questions

\- ✅ Creates a 1-page readable resume

\- ✅ Can download or print without email



---



\### F. Non-Functional Requirements



\- \*\*Performance\*\*: Responses in < 2.5 sec

\- \*\*Accessibility\*\*: WCAG 2.1 AA compliant

\- \*\*Mobile First\*\*: Works on Android/iOS

\- \*\*Offline Support\*\*: Shows fallback resources

\- \*\*Low Bandwidth\*\*: Assets under 200kb/page



---



\### G. Metrics / KPIs



\- Task Completion Rate (by journey)

\- Helpfulness Rating (1-click emoji or thumbs up)

\- Resource Follow-Through (click-to-call or directions)

\- Safety Escalation Deflection (referral success)



---



\### H. Risk Register



| Risk                               | Mitigation                                      |

|------------------------------------|--------------------------------------------------|

| Outdated resource data             | Monthly admin review + freshness flag            |

| Misuse for harm                    | Strict safety refusal patterns in LLM            |

| User distress from confusing text | Reading level constraints enforced at all times |

| High hosting costs (LLM)           | Use quantized model + rate limits               |



---



\### I. MVP → V1 Rollout



\*\*MVP (Month 1–2)\*\*

\- Chat + RAG (local resources)

\- Resource Finder

\- Shelter/food/job flows

\- Admin upload panel



\*\*V1 (Month 3–4)\*\*

\- Resume builder

\- Budget tool

\- Appointment reminders

\- Offline support \& SMS fallback



---



\### J. Testing Plan



\- \*\*Unit Tests\*\*: UI logic, forms, filters

\- \*\*Integration Tests\*\*: Chat flow → Resource → Escalation

\- \*\*Prompt Evaluation\*\*: Response length, clarity, safety

\- \*\*Red-Teaming\*\*: Abuse prompts, hallucination detection

\- \*\*Mobile QA\*\*: Android 8+, iOS 13+ support



================================================================================

SECTION 4: LLM DEPLOYMENT INSTRUCTIONS

================================================================================



\### A) SYSTEM PROMPT (LLM Identity \& Safety Rules)



> You are "Bayou Help" – a calm, respectful assistant for people in Acadiana who are going through a hard time. You speak clearly and simply, like a helpful friend. You never judge or give unsafe advice. You never pretend to be a doctor or lawyer. If someone is in danger or needs help fast, show them a safe next step.

>

> Always:

> - Write at a ~6th grade level

> - Keep answers under 6 short sentences or 8 bullets

> - Use step-by-step lists when helpful

> - Avoid big words or long explanations

> - Say what you do not know

> - Never guess or make things up

> - Never keep memory of what people say



---



\### B) DEVELOPER PROMPT (RAG Integration Rules)



\- Ground every local answer using AnythingLLM documents

\- Always cite source title in brackets (e.g., \[Acadiana Shelters List])

\- Prioritize resources by proximity (parish filter)

\- Use fallback phrases if unsure: “I’m not sure about that, but…”

\- Format resource outputs as:

&nbsp; - Name

&nbsp; - What it offers

&nbsp; - Who can use it

&nbsp; - Hours

&nbsp; - Phone or email

&nbsp; - What to do next



---



\### C) RESPONSE COOKBOOK EXAMPLES



\*\*1. Budgeting on $0\*\*

\- Make a list of what you \*need\* first (food, shelter)

\- Ask for help with free places before spending

\- Try to find 1 thing you can trade or earn each day

\- Use short-term food and shelter first



\*\*2. Irregular income\*\*

\- Write down money from each job or gig

\- Only spend on \*needs\* first

\- Keep some money for later (even $1)

\- Use free services to fill gaps



\*\*3. Find Shelter in Lafayette\*\*

\- St. Joseph Shelter – beds, showers, food

&nbsp; - Men only, 18+

&nbsp; - Lafayette city

&nbsp; - Call: (337) XXX-XXXX

&nbsp; - Go between 3–6 PM to check in



\*\*4. Low-literacy job search\*\*

\- Click “Job Help”

\- Pick what kind of job you want

\- We’ll show local ones near you

\- Tap one to get directions or call



\*\*5. Appointments\*\*

\- Use “Remind Me” to pick a day/time

\- We’ll show it later when you come back

\- You don’t need to log in



\*\*6. Replace ID\*\*

\- You’ll need: 1 photo, 1 paper with your name

\- DMV in Lafayette is open Mon–Fri, 8–4

\- Ask for “ID replacement form”

\- You may qualify for a free one



\*\*7. Mental health crisis\*\*

\- If you feel very sad or want to hurt yourself:

&nbsp; - Call 988

&nbsp; - You don’t need insurance

&nbsp; - They can talk right away

&nbsp; - It’s private



\*\*8. Domestic violence\*\*

\- If someone is hurting you:

&nbsp; - Call Faith House: (337) XXX-XXXX

&nbsp; - Shelter is safe and hidden

&nbsp; - You don’t need to pay

&nbsp; - Call any time



---



================================================================================

SECTION 5: AnythingLLM RAG / DATA SPEC

================================================================================



\*\*Ingestion\*\*

\- Sources: PDFs, CSVs, websites (with scraper or upload)

\- Admin uploads via portal

\- All entries must be tagged by:

&nbsp; - Parish

&nbsp; - Category (shelter, food, ID, health, etc.)

&nbsp; - Freshness date

&nbsp; - Contact method

&nbsp; - Open hours



\*\*Schema\*\*

```json

{

&nbsp; "title": "St. Joseph Shelter",

&nbsp; "category": "shelter",

&nbsp; "parish": "Lafayette",

&nbsp; "what\_it\_provides": "beds, food, showers",

&nbsp; "eligibility": "men only, 18+",

&nbsp; "hours": "3 PM – 6 PM daily",

&nbsp; "contact": "337-XXX-XXXX",

&nbsp; "last\_updated": "2026-01-10"

}

```



\*\*Retrieval Logic\*\*

\- Filter by parish first

\- Filter by category second

\- Prefer most recent entries

\- Deduplicate by title and phone



\*\*Grounding Behavior\*\*

\- Always return answer with \[source]

\- If no result, return fallback: “I didn’t find that, but here’s something close...”



\*\*Evaluation\*\*

\- Weekly relevance audit (10 sampled queries)

\- Feedback from shelters and volunteers



---



================================================================================

SECTION 6: TECHNICAL ARCHITECTURE

================================================================================



\- \*\*Frontend\*\*: React + Vite + Tailwind CSS

\- \*\*Backend\*\*: Node.js server running Ollama locally with Phi-4 (Q4 quantized)

\- \*\*LLM Ops\*\*: AnythingLLM handles ingestion + RAG

\- \*\*Storage\*\*: No user accounts or PII stored

\- \*\*Security\*\*:

&nbsp; - No logs with user input

&nbsp; - Abuse filter in LLM prompt + app-level rate limits

\- \*\*Rate Limits\*\*:

&nbsp; - 10 requests per IP per hour (configurable)

\- \*\*Deployment\*\*:

&nbsp; - Self-hosted VPS or low-cost cloud (e.g., Hetzner, Fly.io)

&nbsp; - Admin panel secured by basic auth



---



================================================================================

SECTION 7: UI / UX SPECIFICATION

================================================================================



\*\*Pages / Routes\*\*

\- `/` Landing Page (What it is, 3 big buttons)

\- `/chat` Chat interface

\- `/resources` Resource finder

\- `/privacy` Help \& Privacy info

\- `/admin` Upload center (auth protected)



\*\*Key Components\*\*

\- Chat UI with 1 input + 3 suggested prompts

\- Resource cards (clean, tappable)

\- Location selector (dropdown for parishes)

\- Privacy mode (hides screen instantly)



\*\*Mobile-First Design Rules\*\*

\- All tap targets ≥ 44px

\- Use system fonts only

\- Max width: 480px

\- No scroll-jacking or popups



\*\*Tailwind Tokens\*\*

\- `text-sm`, `text-base`, `font-sans`

\- `bg-white`, `bg-gray-100`, `bg-red-50`

\- `text-gray-800`, `text-blue-700`, `text-green-600`



\*\*Empty \& Error States\*\*

\- “We couldn’t find anything nearby”

\- “Something went wrong—try again”

\- “You’re offline. Here’s some basic help anyway”



---



END OF DOCUMENT

```



---

> For access to all my prompts, get my Prompt Codex here: \\

> 👉  Volume I: \[Foundations of AI Dialogue and Cognitive Design](https://buymeacoffee.com/Marino25/e/398926) \\

> 👉  Volume II: \[Systems, Strategy \& Specialized Agents](https://buymeacoffee.com/marino25/e/407285) \\

> 👉  Volume III: \[Deep Cognitive Interfaces and Transformational Prompts](https://buymeacoffee.com/marino25/e/408565) \\

> 👉  Volume IV: \[Agentic Archetypes and Transformative Systems](https://buymeacoffee.com/marino25/e/425929) \\

> or, if you found this GPT useful, consider buying me a coffee here: 👉 \[buymeacoffee.com/marino25](https://buymeacoffee.com/marino25) \\

> Your support helps me keep building and sharing.



