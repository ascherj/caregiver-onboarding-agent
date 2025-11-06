# Caregiver Onboarding Agent

A conversational AI agent that onboards caregivers by collecting profile information through natural chat interactions, supporting both text and voice input.

## Quick Start

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting!

## Features

- **Conversational onboarding**: Natural language extraction of 19 profile fields
- **Voice support**: Record voice notes (≤60s) with automatic transcription
- **Live profile preview**: Real-time display of captured information with completion tracking
- **Intelligent extraction**: Validates and structures free-form input into schema fields
- **Smart stop detection**: Knows when enough information has been collected

## AI Usage Disclosure

### Models

- **GPT-4o (gpt-4o-2024-08-06)**: Primary conversational agent
  - Used for: Understanding user intent, extracting structured data, generating natural responses
  - Why: Structured outputs support with Zod schema integration for reliable field extraction

- **Whisper-1**: Speech-to-text transcription
  - Used for: Converting voice notes to text
  - Why: Industry-leading accuracy for conversational audio

### Libraries & Techniques

- **OpenAI SDK** (`openai` v4.77.3): LLM communication and audio transcription
- **Zod** (v3.24.1): Runtime schema validation for structured outputs
  - Ensures LLM responses match expected profile structure
  - Type-safe extraction with `zodResponseFormat` helper

- **Prisma ORM** (v6.1.0): Database schema and queries
  - SQLite for local development
  - Conversation logging with full audit trail

### Where AI is Used

1. **Message Processing** (`lib/executor.ts`)
   - Receives user message → Loads conversation history → Calls LLM with context
   - LLM returns: `{ message: string, extractedData: ProfileFields }`
   - Validates extracted data → Updates profile → Saves conversation

2. **Voice Transcription** (`app/api/transcribe/route.ts`)
   - User uploads audio → Sends to Whisper API → Returns text transcript
   - Transcript processed like any text message

3. **Prompt Engineering** (`lib/prompts.ts`)
   - System prompt defines agent personality, extraction format, and conversation flow
   - Enforces 20-word response limit to prevent token overruns
   - Instructs LLM to reject vague answers for numeric fields (years of experience)

## Architecture & Design

### Conversation Flow

```
User Input (text/voice)
    ↓
Load Conversation History
    ↓
LLM with Structured Output
    ├─→ message: Natural response
    └─→ extractedData: Profile fields
    ↓
Validate & Filter Placeholders
    ↓
Update Profile (only non-null fields)
    ↓
Log Message + Extraction
    ↓
Stream Response to UI
```

### State Machine

**States**: Active conversation per profile (tracked in `ConversationLog` table)

**Lifecycle**:
1. **Start**: New profile created → Active conversation initialized
2. **Turn**: User message → LLM extraction → Profile update → Response
3. **Stop**: Agent detects completion → Sends wrap-up → Marks conversation complete

**Persistence**: Every turn logged with:
- User message
- Agent response
- Raw LLM output (for debugging)
- Extracted fields
- Timestamp

### Stop Condition

Implemented in system prompt (`lib/prompts.ts:54-62`):

**Triggers**:
- All critical fields (location, languages, careTypes, hourlyRate) collected + majority of high-priority fields
- User explicitly says "that's enough", "I'm done", etc.

**Behavior**:
- Brief summary of captured information
- Warm thank you message
- Mention of next steps

### Extraction Approach

**Two-phase validation**:

1. **LLM Phase** (`lib/schema.ts`)
   - Zod schema defines expected structure
   - OpenAI structured outputs ensures JSON conformance
   - All fields nullable/optional to handle partial extraction

2. **Validation Phase** (`lib/tools/extractor.ts`)
   - Filters placeholder values (`.`, `/`, `:null`, empty strings)
   - Validates data types (arrays, objects, strings)
   - Converts to database format (JSON stringification for arrays)

**Field Priority** (defined in prompt):
- **Critical**: location, languages, careTypes, hourlyRate
- **High-priority**: qualifications, startDate, availability, yearsOfExperience, weeklyHours
- **Optional**: All others (commute, dietary preferences, benefits, etc.)

### Modular Agentic Architecture

Inspired by production-grade agent systems (see `docs/AGENTIC_ARCHITECTURE_GUIDE.md`):

```
lib/
├── executor.ts          # Main orchestrator (entry point for conversation turns)
├── conversation/        # Conversation lifecycle management
│   ├── manager.ts       # CRUD operations for conversations
│   └── types.ts         # Type definitions
├── llm/                 # LLM integration layer
│   └── interface.ts     # Streaming responses, token management
├── tools/               # Data processing utilities
│   ├── extractor.ts     # Field extraction and validation
│   └── validator.ts     # Schema validation
└── prompts.ts           # System prompts and instructions
```

**Benefits**:
- Clear separation of concerns
- Testable in isolation
- Easy to extend with new fields or validation rules
- Production-ready error handling

## Schema

All 19 fields from assignment spec implemented in `prisma/schema.prisma`:

**Critical**: location, languages, careTypes, hourlyRate
**High-priority**: qualifications, startDate, generalAvailability, yearsOfExperience, weeklyHours
**Optional**: preferredAgeGroups, responsibilities, commuteDistance, commuteType, willDriveChildren, accessibilityNeeds, dietaryPreferences, additionalChildRate, payrollRequired, benefitsRequired

**Additional system fields**: status, profilePictureUrl, createdAt, updatedAt

## Testing the Application

### Text Flow Demo

1. Start conversation: "Hi"
2. Provide location: "I'm in Brooklyn"
3. Add languages: "I speak English and Spanish"
4. Specify care types: "I do infant care and toddler care"
5. Set rate: "$35 per hour"
6. Add qualifications: "I have CPR and First Aid certifications"
7. Continue until agent signals completion

### Voice Flow Demo

1. Click microphone button
2. Record message: "I'm located in San Francisco and I speak English"
3. Recording auto-stops at 60 seconds (or click stop button)
4. Message transcribed and processed automatically
5. Profile updates in real-time on right panel

### Profile Completeness

- Watch completion percentage increase as fields are filled
- Placeholder values automatically filtered from display
- Only meaningful data shown in preview panel

## CLI Tools

```bash
# Manage conversations directly
npm run cli -- list              # List all conversations
npm run cli -- show <id>         # Show conversation details
npm run cli -- end               # End current conversation
npm run cli -- new               # Start new conversation
```

## Production Recommendations

### Authentication

For production deployment, recommend **NextAuth.js** with:

- **Email/password** for basic auth
- **OAuth providers** (Google, Apple) for easier signup
- **Magic link** authentication for SMS-like UX consistency

**Why NextAuth.js**:
- Built for Next.js App Router
- Supports multiple providers
- Handles session management
- Easy integration with Prisma

**Implementation approach**:
```typescript
// Add to schema
model User {
  id       String   @id @default(cuid())
  email    String   @unique
  profiles CaregiverProfile[]
}

model CaregiverProfile {
  userId String
  user   User @relation(fields: [userId], references: [id])
  // ... existing fields
}
```

### Scaling Considerations

- **Database**: Migrate from SQLite to PostgreSQL for production
- **Rate limiting**: Add request throttling per user/IP
- **File storage**: Use S3/Cloudinary for profile pictures and voice recordings
- **Monitoring**: Add error tracking (Sentry) and analytics
- **Validation**: Server-side input sanitization for security
- **Multi-tenancy**: Isolate data by organization if serving multiple agencies

## Development

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
OPENAI_API_KEY=sk-...
DATABASE_URL="file:./dev.db"
```

### Database Management

```bash
npx prisma studio              # Visual database editor
npx prisma migrate dev         # Create new migration
npx prisma generate            # Regenerate Prisma client
```

### Build & Deploy

```bash
npm run build                  # Production build
npm start                      # Production server
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Database**: SQLite (Prisma ORM)
- **AI**: OpenAI GPT-4o + Whisper
- **Styling**: Tailwind CSS
- **Validation**: Zod

## License

Private assessment project - not for distribution

---

Built with Claude Code - Time spent: ~48 hours
