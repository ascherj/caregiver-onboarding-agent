# Caregiver Onboarding Agent - Implementation Plan

## Executive Summary

**Project:** Conversational AI agent for caregiver onboarding
**Time Constraint:** 48 hours
**Estimated Time:** 27-32 hours
**Status:** Ready to build

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS with Rosie design tokens
- **Real-time:** Server-Sent Events (SSE)

### Backend
- **API:** Next.js API Routes
- **Database:** SQLite
- **ORM:** Prisma
- **AI:** OpenAI GPT-4o (chat) + Whisper (speech-to-text)

### Key Features
- Streaming responses (real-time typewriter effect)
- Voice input with 60-second limit
- Optimistic UI updates
- Structured data extraction via function calling
- Zod validation

## Critical Architecture Decisions

### 1. Streaming Implementation
**Decision:** Implement streaming responses
**Rationale:** Better UX, feels conversational
**Cost:** +5 hours implementation time
**Impact:** Worth it - significantly improves perceived performance

### 2. Data Extraction Strategy
**Tool Definition:**
```typescript
{
  name: "update_caregiver_profile",
  description: "Extract and update caregiver profile information",
  parameters: {
    // All 22 fields: location, languages, careTypes, etc.
  }
}
```

**Tool Choice:** `"auto"` - Let model decide when to extract
**Validation:** Zod schemas before database write
**Why:** Balance between flexibility and data quality

### 3. Voice Input Approach
**Limit:** 60 seconds client-side enforcement
**Flow:** Audio → Whisper API → Text → Chat API
**Error Handling:** Show transcript if Whisper succeeds but chat fails

### 4. Profile Preview Updates
**Strategy:** Optimistic UI
**Flow:**
1. Model calls function → Parse delta
2. Update local state immediately
3. Confirm with server response
4. Show visual feedback (fade-in animation)

## Database Schema

### Caregiver Profile (22 fields)

```prisma
model CaregiverProfile {
  id                  String   @id @default(cuid())
  
  // Personal Information
  firstName           String?
  lastName            String?
  email               String?
  phone               String?
  
  // Location
  city                String?
  state               String?
  zipCode             String?
  
  // Professional Details
  languages           String[] // Array of language codes
  careTypes           String[] // Array: elderly, disability, postop, companionship
  certifications      String[] // Array: CNA, HHA, CPR, FirstAid, etc.
  
  // Experience
  yearsExperience     Int?
  hasTransportation   Boolean?
  hasCarLicense       Boolean?
  
  // Availability
  hourlyRate          Float?
  availableDays       String[] // Array: monday, tuesday, etc.
  availableShifts     String[] // Array: morning, afternoon, evening, overnight
  startDate           DateTime?
  
  // Background
  backgroundCheck     Boolean?
  references          String?  // JSON string or separate model
  additionalNotes     String?
  
  // Metadata
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  conversationState   String?  // JSON for resuming conversations
}
```

## File Structure

```
caregiver-agent/
├── app/
│   ├── layout.tsx              # Root layout with Rosie fonts
│   ├── page.tsx                # Main conversation page
│   ├── globals.css             # Tailwind + custom Rosie styles
│   └── api/
│       ├── chat/
│       │   └── route.ts        # POST - Streaming SSE endpoint
│       ├── transcribe/
│       │   └── route.ts        # POST - Whisper audio → text
│       └── profile/
│           └── route.ts        # GET - Fetch current profile
│
├── components/
│   ├── ChatInterface.tsx       # Main conversation container
│   ├── ChatMessage.tsx         # Individual message bubble (SMS-style)
│   ├── ProfilePreview.tsx      # Live updating profile card
│   ├── VoiceUpload.tsx         # Audio recorder + upload
│   └── ui/
│       ├── Button.tsx          # Rosie-styled button
│       └── Card.tsx            # Rosie-styled card
│
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── agent.ts                # AI orchestrator (streaming + function calls)
│   ├── extractor.ts            # Data extraction logic
│   ├── schema.ts               # TypeScript types + Zod schemas
│   ├── prompts.ts              # System prompts
│   └── utils.ts                # Helpers (date formatting, etc.)
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Auto-generated
│
├── public/
│   └── rosie-logo.svg          # (if provided)
│
├── test-scripts/
│   ├── happy-path.md           # Full successful conversation
│   ├── voice-input.md          # Voice-heavy scenario
│   ├── incomplete-data.md      # Partial information flow
│   └── edge-cases.md           # Error handling scenarios
│
├── planning/
│   └── implementation-plan.md  # This file
│
├── .env.example
├── .env
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Implementation Tasks (20 Tasks)

### Phase 1: Project Setup (4-5 hours)
1. **Initialize Next.js 14 project** with TypeScript (30 min)
2. **Install dependencies** - Prisma, OpenAI SDK, Zod, Tailwind (30 min)
3. **Configure Tailwind** with Rosie design tokens (1 hour)
4. **Set up Prisma** with SQLite + schema (1.5 hours)
5. **Create environment setup** - .env.example (30 min)

### Phase 2: Core AI Logic (8-10 hours)
6. **Define TypeScript types + Zod schemas** (1.5 hours)
7. **Create system prompts** for agent behavior (1 hour)
8. **Build AI agent core** with streaming support (3 hours)
9. **Implement function calling** for data extraction (2 hours)
10. **Add validation layer** with Zod (1.5 hours)

### Phase 3: API Routes (4-5 hours)
11. **/api/chat** - Streaming SSE endpoint (2.5 hours)
12. **/api/transcribe** - Whisper integration (1 hour)
13. **/api/profile** - GET current profile (1 hour)

### Phase 4: Frontend Components (8-10 hours)
14. **ChatInterface** - Main conversation container (2 hours)
15. **ChatMessage** - SMS-style message bubbles (1.5 hours)
16. **ProfilePreview** - Live profile card (2 hours)
17. **VoiceUpload** - Audio recorder component (2.5 hours)
18. **Responsive layout** - Two-panel design (1.5 hours)

### Phase 5: Testing & Polish (3-4 hours)
19. **Test conversation flows** - Run all test scripts (2 hours)
20. **Documentation** - README with setup + AI disclosure (1.5 hours)

**Total: 27-34 hours** (within 48-hour constraint)

## Key Technical Patterns

### 1. Streaming Response Handling

**API Route (Server):**
```typescript
export async function POST(req: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const openAIStream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [...],
        tools: [updateCaregiverProfileTool],
        tool_choice: "auto",
        stream: true
      });

      for await (const chunk of openAIStream) {
        const delta = chunk.choices[0]?.delta;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(delta)}\n\n`));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" }
  });
}
```

**Client (Frontend):**
```typescript
const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify(messages) });
const reader = response.body!.getReader();
const decoder = new TextDecoder();

let buffer = '';
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n\n');
  buffer = lines.pop() || '';
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const delta = JSON.parse(line.slice(6));
      // Update UI with delta
    }
  }
}
```

### 2. Function Call Accumulation

```typescript
let functionCallBuffer = {
  name: '',
  arguments: ''
};

// In stream loop:
if (delta.tool_calls) {
  const toolCall = delta.tool_calls[0];
  if (toolCall.function?.name) {
    functionCallBuffer.name = toolCall.function.name;
  }
  if (toolCall.function?.arguments) {
    functionCallBuffer.arguments += toolCall.function.arguments;
  }
}

// On stream complete:
if (functionCallBuffer.name) {
  const args = JSON.parse(functionCallBuffer.arguments);
  const validated = caregiverSchema.parse(args);
  await prisma.caregiverProfile.update({ data: validated });
}
```

### 3. Voice Input Flow

```typescript
// 1. Client records audio (max 60s)
const audioBlob = await recordAudio({ maxDuration: 60 });

// 2. Upload to /api/transcribe
const formData = new FormData();
formData.append('audio', audioBlob);
const { text } = await fetch('/api/transcribe', { 
  method: 'POST', 
  body: formData 
}).then(r => r.json());

// 3. Add transcript to chat
addMessage({ role: 'user', content: text });

// 4. Send to chat API
await sendToChat(text);
```

## Rosie Design System Integration

### Color Palette
```typescript
// tailwind.config.ts
colors: {
  coral: {
    50: '#FEF6F4',
    100: '#FDECEA',
    200: '#FAD9D4',
    300: '#F8C6BF',
    400: '#F6B3A9',
    500: '#F4B9A8', // Primary
    600: '#F08575',
    700: '#E95F4A',
    800: '#D63E27',
    900: '#A82D1C'
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    500: '#737373',
    700: '#404040',
    900: '#171717'
  }
}
```

### Typography
```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Inter:wght@400;500;600&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3 {
  font-family: 'Merriweather', serif;
}
```

### Component Styling
- **Chat Messages:** SMS-style bubbles, coral for agent, neutral-200 for user
- **Profile Preview:** Card with subtle shadow, coral accent headers
- **Buttons:** Coral primary, neutral secondary
- **Inputs:** Soft borders, coral focus rings

## Testing Strategy

### Test Scripts (4 scenarios)

**1. Happy Path (happy-path.md)**
- Complete conversation flow
- All 22 fields populated
- Mixed text + voice input
- Verify data extraction accuracy

**2. Voice-Heavy (voice-input.md)**
- Mostly voice responses
- Test 60-second limit handling
- Verify Whisper accuracy
- Test error recovery

**3. Incomplete Data (incomplete-data.md)**
- User provides partial information
- Agent asks follow-up questions
- Verify graceful handling of missing fields
- Test profile preview with sparse data

**4. Edge Cases (edge-cases.md)**
- Invalid inputs (malformed phone, email)
- Ambiguous responses
- Conversation interruption/resume
- API failures

### Manual Testing Checklist
- [ ] Desktop responsive (1920x1080)
- [ ] Tablet responsive (768x1024)
- [ ] Mobile responsive (375x667)
- [ ] Streaming renders smoothly
- [ ] Profile updates appear immediately
- [ ] Voice recording works
- [ ] 60-second limit enforced
- [ ] All 22 fields can be populated
- [ ] Error states display properly
- [ ] Loading states are clear

## Environment Variables

```bash
# .env.example

# OpenAI
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL="file:./dev.db"

# Optional: Logging
LOG_LEVEL=info
```

## README Structure

```markdown
# Caregiver Onboarding Agent

## Overview
[Brief description of the project]

## AI Disclosure
This application uses OpenAI's GPT-4o for conversational AI and Whisper for speech-to-text transcription.

## Tech Stack
- Next.js 14, React, TypeScript, Tailwind CSS
- OpenAI GPT-4o + Whisper
- SQLite + Prisma ORM

## Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment: Copy `.env.example` to `.env`
4. Initialize database: `npx prisma migrate dev`
5. Run development server: `npm run dev`

## Features
- Conversational onboarding with streaming responses
- Voice input (up to 60 seconds)
- Real-time profile preview
- Structured data extraction
- Responsive design (Rosie style guide)

## Testing
[Instructions for running test scripts]

## Architecture
[High-level architecture diagram]

## Time Investment
~30 hours total (within 48-hour constraint)
```

## Risk Mitigation

### Technical Risks
1. **Streaming complexity** → Mitigated by using proven SSE pattern
2. **Function call reliability** → Mitigated by Zod validation layer
3. **Whisper API limits** → Enforced 60s client-side, clear error messages
4. **Data consistency** → Single source of truth (database), optimistic UI

### Time Risks
1. **Scope creep** → Strict adherence to 20 required fields, no extras
2. **Styling complexity** → Use Tailwind utilities, minimal custom CSS
3. **Testing time** → Focus on core flows, not exhaustive edge cases

## Success Criteria

### Functional Requirements
- ✅ Conversational agent extracts all 22 caregiver fields
- ✅ Supports text + voice input
- ✅ Real-time profile preview
- ✅ Responsive design matching Rosie style guide
- ✅ Graceful error handling

### Non-Functional Requirements
- ✅ Streaming responses (perceived performance)
- ✅ 60-second voice limit enforced
- ✅ Data validation before persistence
- ✅ Clean, maintainable code
- ✅ Comprehensive documentation

### Deliverables
1. Fully functional Next.js application
2. SQLite database with schema
3. 4 test conversation scripts
4. README with setup instructions
5. AI disclosure statement
6. This implementation plan

## Next Steps

**Status: READY TO BUILD**

### Immediate Actions
1. Initialize Next.js 14 project
2. Install all dependencies
3. Configure Tailwind with Rosie tokens
4. Set up Prisma schema
5. Create base file structure

### Development Order
1. Database + types (foundation)
2. AI agent core (business logic)
3. API routes (integration)
4. Frontend components (UI)
5. Testing + documentation (polish)

**Estimated Start-to-Finish: 27-32 hours**

---

*Plan created: November 4, 2025*
*Ready for implementation approval*
