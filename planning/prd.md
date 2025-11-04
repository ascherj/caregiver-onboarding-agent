# Product Requirements Document
## Caregiver Onboarding Chat Agent

**Version:** 1.0  
**Last Updated:** November 3, 2025  
**Time Constraint:** 48 hours maximum  
**Document Type:** Take-Home Coding Exercise

---

## 1. Executive Summary

Build a conversational AI agent that onboards caregivers through a chat interface. The system should collect structured profile information through natural, human-like conversation, support both text and voice input, and intelligently determine when enough information has been gathered.

### 1.1 Key Objectives
- Create a warm, efficient onboarding experience that feels human
- Extract structured data from conversational input (text or voice)
- Minimize user friction by avoiding repetitive questions
- Know when to stop collecting information
- Persist collected data in a defined schema

---

## 2. User Stories

### Primary User: Caregiver
**As a caregiver**, I want to:
- Share my information conversationally without filling out long forms
- Use either text or voice to communicate (voice notes up to 60 seconds)
- See what information has been captured about my profile
- Complete onboarding efficiently without answering the same question twice
- Know when I'm done with the process

### Secondary User: Reviewer/Developer
**As a reviewer**, I want to:
- See the live profile data as it's being collected
- Understand what AI tools were used and how
- Run the application locally with minimal setup
- Observe both text and voice conversation flows

---

## 3. Functional Requirements

### 3.1 Chat Interface
**Priority:** P0

- **FR-1.1:** Display SMS-style chat interface
  - User messages aligned to one side
  - Agent messages aligned to opposite side
  - Chronological conversation flow

- **FR-1.2:** Support text input
  - Standard text input field
  - Submit on Enter key
  - No character limit restrictions

- **FR-1.3:** Support voice note upload
  - Accept audio files ≤60 seconds
  - Common audio formats (MP3, WAV, M4A, etc.)
  - Clear upload affordance/button

- **FR-1.4:** Agent response pattern
  - Reply with 1-2 concise messages per turn (prefer one)
  - Maintain conversational context
  - No typing indicators required (MVP)

### 3.2 Voice Processing
**Priority:** P0

- **FR-2.1:** Speech-to-text conversion
  - Convert uploaded voice notes to text transcripts
  - Display transcript in chat as user message
  - Process transcript through agent logic

- **FR-2.2:** No text-to-speech required for MVP
  - Agent responds with text only
  - Voice output is out of scope

### 3.3 Agent Intelligence
**Priority:** P0

- **FR-3.1:** Information extraction
  - Parse free-form conversational text
  - Extract relevant facts and map to schema fields
  - Handle multiple facts per message
  - Populate arrays and JSON structures appropriately

- **FR-3.2:** Context maintenance
  - Remember all previously collected information
  - Never re-ask for information already provided
  - Build on previous answers in follow-up questions

- **FR-3.3:** Clarification handling
  - Identify ambiguous or incomplete information
  - Ask targeted follow-up questions
  - Store partial information while awaiting clarification
  - Example: "I'm free afternoons" → Store, then ask "Which days?"

- **FR-3.4:** Conversational acknowledgment
  - Acknowledge what the user just shared
  - Avoid robotic repetition of questions
  - Use natural transitions between topics
  - Confirm inferred details: "Sounds like weekdays 9-5, did I get that right?"

- **FR-3.5:** Intelligent stopping
  - Determine when enough information is collected
  - Recognize user fatigue signals ("that's enough", "I'm done", etc.)
  - Provide friendly wrap-up message
  - Offer summary of captured information

### 3.4 Data Persistence
**Priority:** P0

- **FR-4.1:** Schema compliance
  - Store all collected data in defined caregiver schema
  - Handle optional vs. required fields appropriately
  - Support array and JSON field types

- **FR-4.2:** Real-time updates
  - Update data store as information is collected
  - No manual save action required

- **FR-4.3:** Storage solution
  - In-memory database acceptable for MVP
  - SQLite, Postgres, or similar relational database
  - Must be runnable locally

### 3.5 Profile Preview
**Priority:** P0

- **FR-5.1:** Live profile display
  - Show separate panel/pane with current profile state
  - Update in real-time as data is collected
  - Display all schema fields
  - Indicate which fields are populated vs. empty

- **FR-5.2:** Visual organization
  - Group related fields logically
  - Use clear labels matching schema names
  - Display arrays as lists
  - Format JSON data readably

---

## 4. Conversation Behavior Specifications

### 4.1 Voice & Tone Guidelines
**Priority:** P0

**Required characteristics:**
- **Warm:** Friendly and welcoming, not corporate or robotic
- **Clear:** Easy to understand, no jargon
- **Efficient:** Respect user's time, move conversation forward
- **Human:** Natural phrasing, conversational language

**Specific requirements:**
- Acknowledge what the caregiver just said
- Avoid repeating questions verbatim
- Use 1-2 messages maximum per turn (strongly prefer one)
- Confirm inferred details gently with natural phrasing
- No excessive emojis or overly casual language

### 4.2 Stop Condition Logic
**Priority:** P0

The agent must stop collecting information when:

1. **Completeness threshold met:**
   - All critical fields collected (location, languages, careTypes, hourlyRate), AND
   - ≥80% of total fields populated, OR

2. **User signals completion:**
   - Explicit statements: "that's enough", "I'm done", "that's all"
   - Implicit signals: short answers, declining to answer, fatigue indicators

**When stopping:**
1. Send short recap of captured information
2. If any critical field is missing, ask for that one item
3. Provide next steps or thank you message
4. Optionally mention resume/photo upload (if implementing)

### 4.3 Conversation Flow Requirements

**Opening:**
- Warm greeting
- Brief explanation of process
- Start with first question

**Middle:**
- Ask for one or two related pieces of information per turn
- Build naturally on previous answers
- Prioritize critical fields early
- Group related questions logically

**Closing:**
- Recognize when to stop (see stop condition)
- Summarize collected information
- Thank user and provide next steps

---

## 5. Data Schema

### 5.1 Caregiver Profile Fields

```typescript
{
  // Critical fields (required for viable profile)
  location: string,              // Geographic location
  languages: string[],           // Languages spoken
  careTypes: string[],           // Types of care provided
  hourlyRate: string,            // Hourly rate (with currency)
  
  // High-priority optional fields
  qualifications: string[],      // Certifications, degrees, training
  startDate: string,             // Availability start date
  generalAvailability: string,   // Free-form schedule description
  yearsOfExperience: {           // JSON breakdown by care type
    [careType: string]: number
  },
  weeklyHours: string,           // Desired hours per week
  
  // Standard optional fields
  preferredAgeGroups: string[],  // Age ranges preferred
  responsibilities: string[],    // Specific duties willing to do
  commuteDistance: string,       // Max commute distance
  commuteType: string,           // Transportation method
  willDriveChildren: string,     // Yes/No/Maybe
  
  // Additional details
  accessibilityNeeds: string,    // Any accessibility requirements
  dietaryPreferences: string[],  // Dietary restrictions/preferences
  additionalChildRate: string,   // Rate for additional children
  payrollRequired: string,       // Payroll service needed
  benefitsRequired: string[],    // Desired benefits
  
  // System fields
  status: string,                // Default: "in_progress"
  profilePictureUrl: string,     // Profile photo URL (optional)
}
```

### 5.2 Field Priorities

**Critical (must collect):**
- location
- languages
- careTypes
- hourlyRate

**High-value (strongly encouraged):**
- qualifications
- startDate
- generalAvailability
- yearsOfExperience
- weeklyHours

**Optional (collect if natural):**
- All remaining fields

### 5.3 Data Safety Requirements
**Priority:** P0

**Never collect:**
- Social Security Number (SSN)
- Date of Birth
- Full home address (general location only)
- Banking information
- Government ID numbers
- Any sensitive personal information beyond schema

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Agent response time: <3 seconds for text input
- Voice transcription: <10 seconds for 60-second audio
- UI updates: Real-time (no manual refresh needed)

### 6.2 Usability
- Mobile-friendly responsive design
- Clear visual distinction between user and agent messages
- Intuitive voice note upload mechanism
- Profile preview always visible or easily accessible

### 6.3 Reliability
- Handle malformed or nonsensical user input gracefully
- Continue conversation if single extraction fails
- Store partial data even if conversation interrupted

### 6.4 Time Constraint
- **Maximum development time: 48 hours**
- Prioritize core functionality over polish
- MVP scope - additional features are out of scope

---

## 7. Technical Requirements

### 7.1 Suggested Technology Stack
*Note: These are suggestions, not requirements. Use what you're comfortable with.*

**Frontend:**
- Next.js/React (or any modern framework)
- Simple chat pane + profile preview
- Responsive design (mobile-friendly)

**Agent/AI:**
- OpenAI GPT models with function calling, OR
- Anthropic Claude with tool use, OR
- Custom extraction logic with LLM support
- Clear documentation of approach chosen

**Backend:**
- Node.js/Python/Your preference
- RESTful API or tRPC
- Handle file uploads for voice notes

**Speech-to-Text:**
- OpenAI Whisper API
- Google Cloud Speech-to-Text
- AssemblyAI
- Or similar service

**Database:**
- SQLite (recommended for local dev)
- PostgreSQL
- Prisma/Drizzle ORM
- In-memory store acceptable for MVP
- Must be runnable locally

**State Management:**
- Track conversation history
- Maintain extraction state
- Store partial/incomplete fields

### 7.2 Authentication Considerations
*Not required for MVP, but document your recommendation*

For production, recommend:
- Auth approach (OAuth, magic links, etc.)
- User session management strategy
- Data access controls

---

## 8. AI Usage Disclosure Requirements
**Priority:** P0

The README must include:

### 8.1 Models Used
- Specific model names and versions (e.g., "GPT-4o", "Claude 3.5 Sonnet")
- Purpose of each model (e.g., conversation, extraction, classification)

### 8.2 Prompt Engineering
- High-level approach to prompting
- System prompts or key instructions
- How prompts guide extraction and conversation

### 8.3 Libraries & Tools
- LangChain, LlamaIndex, or custom orchestration
- Vector databases or embeddings (if used)
- Any AI-related SDKs or frameworks

### 8.4 Implementation Details
- Where AI is used in the flow (conversation, extraction, both)
- How structured data is extracted from conversational text
- How stop conditions are determined

---

## 9. Deliverables

### 9.1 Code Repository
**Priority:** P0

Must include:

1. **README.md** containing:
   - Quick start instructions (2-3 commands to run locally)
   - AI usage disclosure (see Section 8)
   - Design notes:
     - State machine/conversation flow diagram or description
     - Stop condition logic explanation
     - Extraction approach overview
   - Technology choices and rationale
   - Any assumptions made

2. **Source code:**
   - Clean, organized file structure
   - Basic code comments for complex logic
   - Configuration files included

3. **Database setup:**
   - Schema definition file
   - Minimal seed script or demo data (optional)
   - Migration files (if applicable)

4. **Dependencies:**
   - Package.json / requirements.txt / equivalent
   - Lock files committed
   - .env.example file with required environment variables

### 9.2 Live Demonstration
**Priority:** P0

Be prepared to demonstrate:

1. **Text conversation flow:**
   - Complete onboarding via text messages
   - Show data extraction in real-time
   - Demonstrate stop condition triggering
   - View final saved profile

2. **Voice conversation flow:**
   - Upload voice note
   - Show transcription
   - Continue conversation based on voice input
   - Demonstrate data persistence

3. **Edge cases (time permitting):**
   - Ambiguous input handling
   - Context carryover
   - User saying "that's enough" early

### 9.3 Demo Script (Recommended)
Prepare a sample conversation that demonstrates:
- Natural multi-turn conversation
- Information extraction across multiple messages
- Array population (qualifications, languages)
- JSON structure (yearsOfExperience)
- Stop condition trigger
- Final profile view

---

## 10. Success Criteria

The submission will be evaluated on:

### 10.1 Core Functionality (60%)
- ✅ Chat interface works (text + voice)
- ✅ Agent extracts data correctly from conversational input
- ✅ Data persists to schema-compliant store
- ✅ Profile preview updates in real-time
- ✅ Stop condition works appropriately
- ✅ Voice notes are transcribed and processed

### 10.2 Conversation Quality (20%)
- ✅ Natural, warm tone maintained
- ✅ Context is carried between messages
- ✅ No repeated questions for answered items
- ✅ 1-2 messages per turn (efficient)
- ✅ Graceful stop and wrap-up

### 10.3 Technical Implementation (15%)
- ✅ Runs locally with clear instructions
- ✅ Code is organized and readable
- ✅ Appropriate use of AI tools
- ✅ Schema compliance
- ✅ Reasonable error handling

### 10.4 Documentation (5%)
- ✅ Clear README
- ✅ Honest AI usage disclosure
- ✅ Design decisions explained
- ✅ Setup instructions work

---

## 11. Out of Scope (MVP)

The following are explicitly **not required** for this exercise:

- ❌ User authentication/login
- ❌ Multiple caregiver profiles or user management
- ❌ Resume/photo upload functionality (mention is sufficient)
- ❌ Text-to-speech (agent voice output)
- ❌ Real-time typing indicators
- ❌ Message editing or deletion
- ❌ Conversation history persistence beyond current session
- ❌ Admin dashboard or caregiver review interface
- ❌ Production deployment
- ❌ Extensive error handling for network failures
- ❌ Internationalization/localization
- ❌ Accessibility compliance (WCAG)
- ❌ Unit tests (nice to have, not required)
- ❌ Beautiful UI/extensive styling

---

## 12. Example Conversation Flow

### Ideal Conversation Pattern:

**Agent:** "Hi! I'm here to help you get set up as a caregiver. Let's start with the basics—where are you located, and what languages do you speak?"

**User:** "I'm in Brooklyn and I speak English and Spanish"

**Agent:** "Great! Brooklyn and bilingual—that's awesome. What type of care are you looking to provide? For example, infant care, toddler care, after-school care, etc."

**User:** "I mostly do infant and toddler care, I have 5 years experience with babies"

**Agent:** "Perfect! So 5 years with infants. Do you have experience with toddlers too, or just getting started with that age group?"

**User:** "Yeah, 3 years with toddlers"

**Agent:** "Excellent. What's your hourly rate?"

**User:** "I charge $25 per hour"

**Agent:** "Got it, $25/hour. When are you available to start, and what does your typical schedule look like?"

*[Conversation continues...]*

**Agent (at stop condition):** "Thanks for sharing all that! Here's what I have: You're in Brooklyn, speak English and Spanish, provide infant and toddler care with 5 and 3 years of experience respectively, charge $25/hour, and are available weekdays 9-5 starting next month. The only thing we're missing is your qualifications—do you have any certifications like CPR or formal training?"

**User:** "Yes, CPR certified and I have a degree in early childhood education"

**Agent:** "Perfect! That completes your profile. You're all set! Someone from our team will review your information and reach out within 24 hours. If you'd like, you can upload a profile photo later from your dashboard. Thanks for completing your profile! 🌟"

---

## 13. Questions & Assumptions

### Assumptions Allowed:
- Single conversation session (no need to resume later)
- English language interface only
- Basic validation (e.g., rate is numeric)
- US-centric location and currency assumptions
- Single caregiver profile (no switching between users)

### If Unclear:
- Make reasonable assumptions
- Document them in README
- Proceed with MVP mentality

---

## Appendix A: Evaluation Rubric

| Criterion | Weight | Excellent (5) | Good (3) | Needs Work (1) |
|-----------|--------|---------------|----------|----------------|
| **Data Extraction** | 15% | Accurately extracts all field types from natural language | Extracts most fields, minor issues | Frequently misses information |
| **Conversation Quality** | 15% | Natural, warm, efficient; perfect context | Mostly natural, occasional repetition | Robotic or repetitive |
| **Stop Logic** | 10% | Stops at perfect moment with good summary | Stops appropriately but abruptly | Unclear when it stops |
| **Voice Support** | 10% | Seamless voice transcription and processing | Works but clunky | Barely functional |
| **Data Persistence** | 10% | Perfect schema compliance, real-time updates | Works with minor issues | Inconsistent or broken |
| **Profile Preview** | 5% | Live, well-organized, clear | Functional but basic | Hard to read |
| **Code Quality** | 10% | Clean, organized, commented | Readable, mostly organized | Messy or unclear |
| **AI Disclosure** | 5% | Comprehensive and honest | Basic but sufficient | Vague or incomplete |
| **Documentation** | 10% | Excellent README, runs perfectly | Good instructions, minor hiccups | Unclear or doesn't run |
| **Demo** | 10% | Flawless demo of both flows | Demonstrates core functionality | Significant issues |

---

**End of PRD**

*This document should serve as your complete reference for building the caregiver onboarding chat agent. Focus on the P0 requirements first, and deliver a working MVP that demonstrates the core conversational AI capabilities. Good luck!*
