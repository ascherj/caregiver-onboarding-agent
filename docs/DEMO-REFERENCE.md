# Caregiver Agent - Demo Quick Reference

## 🎯 Project Overview
**What it does**: Conversational AI that onboards caregivers through chat (text/voice), extracting 19+ profile fields from natural language into a structured database.

**Tech Stack**: Next.js 15 (App Router) • TypeScript • Prisma (SQLite) • OpenAI GPT-4o + Whisper • Zod validation

**Time to build**: ~48 hours (assignment constraint)

---

## 🏗️ Architecture at a Glance

### Modular Agentic Structure
```
lib/executor.ts          → Main orchestrator (conversation entry point)
lib/conversation/        → Conversation lifecycle (CRUD, sliding window)
lib/llm/interface.ts     → LLM streaming + token management
lib/tools/extractor.ts   → Data validation + placeholder filtering
lib/prompts.ts           → System prompt with extraction logic
```

**Data Flow**: User Input → Load History → LLM Call → Extract Data → Validate → Update Profile → Save Message → Stream Response

---

## 🔑 Key Technical Decisions

### 1. Structured Outputs (Not Function Calling)
- **Pattern**: LLM returns `{ message: string, extractedData: ProfileFields }` in single response
- **Why**: Simpler than function calling, guaranteed JSON format via Zod schema
- **Implementation**: `zodResponseFormat(agentResponseSchema)` in lib/agent.ts:25

### 2. Sliding Window Context (20 messages)
- **Location**: lib/conversation/manager.ts:143
- **Why**: Prevents token overflow in long conversations
- **Tradeoff**: Loses early context, but maintains recent conversation flow

### 3. Placeholder Filtering
- **Location**: lib/tools/extractor.ts:72-88
- **Filters**: `.`, `/`, `:null`, `null` strings, empty arrays
- **Why**: LLM sometimes outputs placeholder values instead of null - we clean them

### 4. Token Limit Safeguards
- **Limit**: 4000 tokens (lib/llm/interface.ts:42)
- **Why**: Increased from 2000 to handle final summaries without truncation
- **Detection**: Checks for incomplete JSON and prompts retry

---

## 📊 Schema (19 Fields Total)

**Critical (4)**: location, languages, careTypes, hourlyRate
**High-Priority (5)**: qualifications, startDate, generalAvailability, yearsOfExperience, weeklyHours
**Optional (10)**: preferredAgeGroups, responsibilities, commute*, willDriveChildren, dietary*, benefits*

**Special Types**:
- `yearsOfExperience`: JSON object `{"infant": 5, "toddler": 3}`
- Arrays: languages, qualifications, careTypes, etc. (stored as JSON strings in SQLite)

---

## 💬 Conversation Intelligence

### Stop Conditions (lib/prompts.ts:54-62)
**Triggers**:
1. All 4 critical fields + 3+ high-priority fields collected, OR
2. User says "that's enough", "I'm done", etc.

**Behavior**: Brief recap → Thank you → "We'll be in touch with next steps"

### Prompt Engineering Highlights
- **20-word response limit** (prevents token overruns)
- **No placeholder values** (uses `null` instead)
- **Numeric validation** for yearsOfExperience (rejects "all", "lots")
- **Warm tone**: Acknowledges input, asks next question naturally

---

## 🗄️ Database Structure

### 3 Tables (Prisma schema)

**CaregiverProfile**: 19 profile fields + metadata (createdAt, updatedAt, status)

**ConversationLog**: Tracks conversation lifecycle
- Fields: conversationId, profileId, status (active/completed), timestamps

**ConversationMessage**: Individual message exchanges
- Fields: userMessage, agentResponse, llmRawResponse, extractedData, extractedFields, timestamp

**Audit Trail**: Every conversation fully logged with:
- What user said
- What agent responded
- What data was extracted
- When it happened

---

## 🎙️ Voice Support

**Flow**: User uploads audio (≤60s) → POST /api/transcribe → Whisper API → Text transcript → Processed as text message

**Model**: Whisper-1 (OpenAI)

**No TTS**: Agent responds with text only (voice output out of scope)

---

## 🚀 Demo Script

### Quick Start
```bash
npm install
cp .env.example .env    # Add OPENAI_API_KEY
npx prisma migrate deploy
npm run dev             # → http://localhost:3000
```

### Demo Flow
1. **Text conversation**: "Hi" → location → languages → care types → rate → qualifications
2. **Voice note**: Upload audio describing experience
3. **Profile preview**: Watch right panel update in real-time
4. **Stop condition**: Agent wraps up when enough info collected
5. **Database inspection**: `npx prisma studio` to see raw data

### CLI Tools (Helpful for Demo)
```bash
npm run cli -- list              # Show all profiles/conversations
npm run cli -- show <convId>     # Full conversation transcript
npm run cli -- stats <convId>    # Completion %, field count, duration
```

---

## 🎨 UI Components

**ChatInterface.tsx**: Main chat pane with text + voice input, auto-focus for seamless flow
**ProfilePreview.tsx**: Live profile display, filters nulls/placeholders, shows completion %
**VoiceUpload.tsx**: Audio recording (max 60s), upload to transcription API
**ChatMessage.tsx**: SMS-style message bubbles (user right, agent left)

---

## ⚡ Performance Optimizations

**Real-time updates**: Profile preview updates via extraction events (no polling)
**Streaming responses**: Character-by-character streaming for natural feel
**Auto-focus**: Input refocuses after each message for typing flow
**Error recovery**: Graceful fallback if LLM parse fails or response truncates

---

## 🔍 What Makes This Production-Ready

1. **Comprehensive logging**: Every turn saved with extracted data + raw LLM output
2. **Modular architecture**: Clean separation (executor → conversation → LLM → tools)
3. **Validation layers**: Zod schema + custom placeholder filtering
4. **Error handling**: Graceful degradation (conversation continues even if extraction fails)
5. **Context management**: Sliding window prevents token overflow
6. **Type safety**: Full TypeScript + Prisma types throughout

---

## 🤖 AI Usage Disclosure

### Development (Code Generation)
- **Claude Code, OpenCode, Cursor**: Primary coding agents
- **Claude Sonnet 4.5 (extended thinking)**: PRD + architecture planning
- **Wispr Flow**: Voice input for faster development

### Production (In-App)
- **GPT-4o (gpt-4o-2024-08-06)**: Conversational agent + structured extraction
- **Whisper-1**: Speech-to-text transcription
- **Zod**: Schema validation for LLM responses (runtime type checking)

---

## 💡 Design Tradeoffs

**Chose Structured Outputs Over Function Calling**
- ✅ Simpler: Single response contains both message + data
- ✅ Reliable: Guaranteed JSON format
- ❌ Less flexible: Can't dynamically call tools

**Chose SQLite Over Postgres**
- ✅ Zero setup: File-based, easy local dev
- ✅ Fast: In-process, no network latency
- ❌ Not production-ready: Recommend Postgres for deployment

**Chose Sliding Window (20 msgs) Over Full History**
- ✅ Prevents token overflow
- ✅ Maintains recent context
- ❌ Loses early conversation details (acceptable for onboarding)

---

## 🚨 Common Demo Issues

**Issue**: Agent repeats questions
**Fix**: Check conversation history is loading (lib/executor.ts:39-52)

**Issue**: Data not saving
**Fix**: Verify placeholder filtering isn't too aggressive (lib/tools/extractor.ts:72)

**Issue**: Response cuts off mid-sentence
**Fix**: Token limit reached - prompt is brief (20 words) to prevent this

**Issue**: Profile preview shows null values
**Fix**: Filtering logic in ProfilePreview.tsx:16 removes them from display

---

## 📈 Metrics to Highlight

- **19 profile fields** collected conversationally
- **Sliding window**: Last 20 messages kept in context
- **4000 token limit** prevents truncation
- **20-word response limit** ensures concise, efficient conversations
- **Full audit trail** of every conversation turn + extracted data

---

## 🎓 Key Files to Reference During Demo

| File | Purpose | Key Line Numbers |
|------|---------|------------------|
| lib/prompts.ts | System prompt + stop logic | 9 (word limit), 54 (stop conditions) |
| lib/executor.ts | Main orchestrator | 23 (entry point), 62 (LLM call) |
| lib/conversation/manager.ts | History management | 143 (sliding window) |
| lib/tools/extractor.ts | Data validation | 72 (placeholder filtering) |
| prisma/schema.prisma | Database schema | 10-51 (CaregiverProfile) |

---

## 🎤 Talking Points for Assessors

1. **Modular architecture**: Easy to extend, test, and maintain
2. **Production-grade logging**: Full audit trail for compliance/debugging
3. **Intelligent stopping**: Knows when to end conversation (not just field count)
4. **Robust validation**: Two-phase (LLM schema + custom filtering)
5. **Performance-focused**: Sliding window, token limits, streaming responses
6. **Voice support**: Seamless transcription → processing pipeline

---

## 🔮 Production Recommendations

**Auth**: NextAuth.js with email/password + OAuth (Google, Apple)
**Database**: Migrate to PostgreSQL
**File Storage**: S3/Cloudinary for profile pictures + voice recordings
**Monitoring**: Sentry for errors, PostHog for analytics
**Rate Limiting**: Per-user/IP throttling
**Security**: Input sanitization, CSRF protection

---

## 📝 One-Sentence Summary

*"A conversational AI that extracts structured caregiver profiles from natural chat (text/voice), with intelligent stopping, full audit logging, and production-ready architecture - built in 48 hours."*
