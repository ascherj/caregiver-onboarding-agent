# Caregiver Onboarding Agent

A conversational AI agent that onboards caregivers by collecting profile information through natural chat interactions, supporting both text and voice input.

## Quick Start

```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
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

### Development Tools

This project was built with AI-assisted development tools:

- **[Claude Code](https://www.claude.com/product/claude-code), [OpenCode](https://opencode.ai/docs/), & [Cursor](https://cursor.com/)**: Primary coding agents for implementation
  - Used for: Code generation, architecture design, debugging, and refactoring
  - Why: Accelerated development while maintaining code quality and consistency

- **Claude Sonnet 4.5 (with extended thinking)**: Planning and design
  - Used for: Constructing Product Requirements Document (PRD) and implementation strategy
  - Why: Deep reasoning for architectural decisions and requirement analysis

- **Wispr Flow**: Speech-to-text input for development
  - Used for: Voice-driven interaction with coding agents
  - Why: Faster natural language communication during development

### Models (in Application)

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

Inspired by production-grade agent systems (see `docs/agentic-architecture-guide.md`):

```
lib/
├── executor.ts          # Main orchestrator (entry point for conversation turns)
├── conversation/        # Conversation lifecycle management
│   ├── manager.ts       # CRUD operations, sliding window context
│   └── types.ts         # Type definitions
├── llm/                 # LLM integration layer
│   └── interface.ts     # Streaming, token management, context formatting
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
- Sliding window context management (last 20 messages)
- Auto-focus UX for seamless conversation flow

## Schema

All 19 fields from assignment spec implemented in `prisma/schema.prisma`:

**Critical**: location, languages, careTypes, hourlyRate
**High-priority**: qualifications, startDate, generalAvailability, yearsOfExperience, weeklyHours
**Optional**: preferredAgeGroups, responsibilities, commuteDistance, commuteType, willDriveChildren, accessibilityNeeds, dietaryPreferences, additionalChildRate, payrollRequired, benefitsRequired

**Additional system fields**: status, profilePictureUrl, createdAt, updatedAt

## Recent Improvements

The application has been iteratively refined based on real-world testing:

### Performance & Reliability
- **Sliding window context** (lib/llm/interface.ts:222): Maintains last 20 messages to prevent token overflow in long conversations
- **4000 token limit** (lib/llm/interface.ts:42): Increased from 2000 to accommodate final summaries while preventing truncation
- **Token limit safeguards** (lib/llm/interface.ts:56): Detects truncated responses and prompts retry without data loss

### User Experience
- **Auto-focus input** (components/ChatInterface.tsx:150): Input field refocuses after each message for seamless typing flow
- **Null value filtering** (components/ProfilePreview.tsx:16): Profile preview hides empty/placeholder fields for clean display
- **Completion tracking** (components/ProfilePreview.tsx:67): Real-time percentage calculation excludes null values

### Data Quality
- **Placeholder filtering** (lib/tools/extractor.ts): Removes `.`, `/`, `:null`, `null` strings before storage
- **Array null filtering** (components/ProfilePreview.tsx:24): Arrays cleaned of null entries before display
- **Numeric validation** (lib/prompts.ts:30): Rejects vague answers like "all" or "lots" for yearsOfExperience

### Error Handling
- **Stream error recovery** (lib/llm/interface.ts:126): Graceful fallback when LLM responses fail to parse
- **Response cleanup** (lib/llm/interface.ts:198): Removes meta-references like "based on the extracted data"
- **Parse error logging** (lib/llm/interface.ts:150): Detailed error context for debugging truncation issues

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

## Demo Script

The CLI tool serves as a demo interface for inspecting conversations and database state:

```bash
# List all profiles and conversations
npm run cli -- list

# Show full conversation history with extracted data
npm run cli -- show <conversationId>

# Show conversation statistics (completion, duration, fields extracted)
npm run cli -- stats <conversationId>

# View analytics across all conversations
npm run cli -- analytics

# Export conversation to JSON file
npm run cli -- export <conversationId> output.json

# Mark conversation as completed
npm run cli -- end <conversationId>
```

**Visual database inspection:**
```bash
npx prisma studio  # Opens at http://localhost:5555
```

**Typical demo workflow:**
1. Run the app and complete a conversation
2. Use `npm run cli -- list` to see all profiles/conversations
3. Use `npm run cli -- show <id>` to view full conversation transcript
4. Use `npm run cli -- stats <id>` to see completion percentage and extracted fields
5. Use `npx prisma studio` to inspect raw database records

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

Copy `.env.example` to `.env`:

```bash
OPENAI_API_KEY=sk-...
DATABASE_URL="file:./dev.db"
```

**Note**: Use `.env` (not `.env.local`) to ensure compatibility with both Next.js and Prisma CLI tools.

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
