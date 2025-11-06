# Architecture Refactoring Plan: Agentic Best Practices

## Document Overview

**Created:** November 6, 2025  
**Author:** Architecture Refactor based on Secret Agents Architecture Guide  
**Status:** Planning Phase - Enhancement to Existing Implementation  
**Estimated Time:** 8-12 hours  
**Goal:** Apply best practices from Secret Agents architecture to improve separation of concerns, observability, and maintainability

**Context:** This is **Phase 6** of the project, building on the completed implementation from `implementation-plan.md` (Phases 1-5). The application is fully functional; this refactor enhances its architecture for production readiness.

---

## Project Status: What's Already Complete

### ✅ **Completed from Original Implementation Plan**

**Phase 1: Project Setup (100%)**
- ✅ Next.js 14 with TypeScript
- ✅ All dependencies installed (Prisma, OpenAI SDK, Zod, Tailwind)
- ✅ Tailwind configured with Rosie design tokens
- ✅ Prisma + SQLite database
- ✅ Environment configuration

**Phase 2: Core AI Logic (100%)**
- ✅ TypeScript types + Zod schemas (`lib/schema.ts`)
- ✅ System prompts (`lib/prompts.ts`)
- ✅ AI agent with streaming (`lib/agent.ts`)
- ✅ Structured outputs using `zodResponseFormat`
- ✅ Validation layer with Zod

**Phase 3: API Routes (100%)**
- ✅ `/api/chat` - Streaming SSE endpoint (82 lines)
- ✅ `/api/transcribe` - Whisper integration
- ✅ `/api/profile` - GET/POST profile endpoints

**Phase 4: Frontend Components (100%)**
- ✅ ChatInterface - Main conversation container
- ✅ ChatMessage - SMS-style message bubbles
- ✅ ProfilePreview - Live updating profile card
- ✅ VoiceUpload - Audio recorder component
- ✅ Responsive two-panel layout

**Phase 5: Testing & Polish (Partial)**
- ✅ Application is fully functional and tested manually
- ❌ Test scripts not created (to be added later)
- ❌ Comprehensive README not created

### 📊 **Current Database Schema**

```prisma
model CaregiverProfile {
  id                  String   @id @default(cuid())
  
  // Critical fields
  location            String?
  languages           String?  // JSON array
  careTypes           String?  // JSON array
  hourlyRate          String?
  
  // High-priority fields
  qualifications      String?  // JSON array
  startDate           String?
  generalAvailability String?
  yearsOfExperience   String?  // JSON object
  weeklyHours         String?
  
  // Optional fields
  preferredAgeGroups  String?  // JSON array
  responsibilities    String?  // JSON array
  commuteDistance     String?
  commuteType         String?
  willDriveChildren   String?
  accessibilityNeeds  String?
  dietaryPreferences  String?  // JSON array
  additionalChildRate String?
  payrollRequired     String?
  benefitsRequired    String?  // JSON array
  
  // System fields
  status              String   @default("in_progress")
  profilePictureUrl   String?
  
  // Metadata
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  conversationHistory String?  // JSON array of messages
}
```

### 🎯 **What This Refactor Adds**

This architecture enhancement builds on the working implementation by adding:

1. **Separation of Concerns** (NEW)
   - Modular structure: `lib/llm/`, `lib/conversation/`, `lib/tools/`
   - Clear layer boundaries
   - Improved testability

2. **Rich Conversation Logging** (NEW)
   - Database models: `ConversationLog`, `ConversationMessage`
   - Track LLM raw responses, extraction events
   - Full audit trail for debugging and analytics

3. **Error Handling as Values** (NEW)
   - `Result<T>` pattern throughout
   - Graceful degradation (no crashes)
   - User-friendly error messages

4. **CLI Management Tool** (NEW)
   - Inspect conversations
   - Debug extraction issues
   - Export data for analysis

5. **Unit Testing Infrastructure** (NEW)
   - Test individual modules in isolation
   - Integration tests for full flow

---

## Executive Summary

This refactoring applies proven agentic architecture patterns from the Secret Agents project to the Caregiver Onboarding Agent. The primary focus is on three key improvements:

1. **Separation of Concerns**: Break monolithic API route into dedicated modules
2. **Rich Conversation Logging**: Add comprehensive interaction tracking for debugging and analytics
3. **Error Handling as Values**: Implement graceful degradation patterns

### Benefits
- **Maintainability**: Clear module boundaries make code easier to understand and modify
- **Debuggability**: Full interaction logging enables replay and troubleshooting
- **Testability**: Isolated modules can be unit tested independently
- **Observability**: Track extraction patterns, LLM behavior, and user interactions
- **Reliability**: Graceful error handling prevents conversation crashes

---

## Current Architecture Analysis

### Current Structure (Working Implementation)

```
lib/
├── agent.ts          # LLM communication + streaming (70 lines)
├── db.ts             # Prisma client
├── prompts.ts        # System prompt
├── schema.ts         # Zod schemas

app/api/
├── chat/route.ts     # Handles EVERYTHING (82 lines)
├── profile/route.ts  # Get/Create profile
├── transcribe/route.ts # Whisper transcription
```

### Current Flow
```
User Input → API Route → agent.ts → OpenAI → API Route → Database → Response
                ↓                                          ↓
          Handles streaming                        Handles extraction
          Handles errors                           Handles validation
          Handles coordination                     Handles persistence
```

### What Works Well

1. ✅ **Functional and Complete**: Application works end-to-end
2. ✅ **Streaming Responses**: Real-time typewriter effect
3. ✅ **Structured Outputs**: Reliable data extraction with `zodResponseFormat`
4. ✅ **Voice Input**: Whisper integration working
5. ✅ **Profile Updates**: Optimistic UI with database sync

### What Can Be Improved (Why This Refactor)

1. **Tight Coupling**: API route handles coordination, streaming, DB updates, and error handling
2. **No Conversation Logging**: Lost visibility into LLM raw responses and extraction events
3. **Hard to Test**: Can't test LLM interface without spinning up API routes
4. **Error Propagation**: Exceptions bubble up instead of being handled gracefully
5. **No Conversation Lifecycle**: Each request is stateless, no conversation history tracking beyond JSON field

---

## Target Architecture

### New Modular Structure

```
lib/
├── llm/
│   └── interface.ts              # Pure LLM communication layer
├── conversation/
│   ├── manager.ts                # Conversation lifecycle & persistence
│   └── types.ts                  # Conversation-specific types
├── tools/
│   ├── extractor.ts              # Data extraction tool
│   ├── validator.ts              # Validation tool
│   └── types.ts                  # Tool result types
├── executor.ts                   # Main orchestrator
├── agent.ts                      # [Legacy - keep for compatibility]
├── db.ts                         # [Existing]
├── prompts.ts                    # [Existing]
└── schema.ts                     # [Existing]

conversation-manager.ts            # CLI tool (root level)
```

### New Flow with Separation of Concerns

```
User Input
    ↓
API Route (thin coordinator - ~40 lines)
    ↓
Executor (orchestration)
    ↓
┌─────────────┬──────────────┬────────────────┐
│             │              │                │
│ LLM         │ Tools        │ Conversation   │
│ Interface   │ (Extractor,  │ Manager        │
│             │  Validator)  │                │
└─────────────┴──────────────┴────────────────┘
    ↓             ↓                ↓
  OpenAI      Validation      Database
    ↓             ↓                ↓
Response  →  Extracted Data  →  Saved State
                                   ↓
                            Full Interaction Log
```

---

## Implementation Plan

### Phase 1: Enhanced Database Schema

#### Add Conversation Logging Tables

**New Models:**

```prisma
// Tracks conversation lifecycle
model ConversationLog {
  id              String   @id @default(cuid())
  profileId       String
  conversationId  String   @unique
  status          String   @default("active") // active, completed, abandoned
  startedAt       DateTime @default(now())
  lastUpdatedAt   DateTime @updatedAt
  version         Int      @default(1) // For migration support
  
  messages        ConversationMessage[]
  
  profile         CaregiverProfile @relation(fields: [profileId], references: [id])
  
  @@index([profileId])
  @@index([status])
}

// Tracks individual message exchanges
model ConversationMessage {
  id                 String   @id @default(cuid())
  conversationId     String
  timestamp          DateTime @default(now())
  
  // User input
  userMessage        String
  
  // Agent output
  agentResponse      String
  
  // Raw LLM response (for debugging)
  llmRawResponse     String   // Full structured output from LLM
  
  // Extraction tracking
  extractedData      String?  // JSON of what was extracted this turn
  extractedFields    String?  // JSON array of field names extracted
  
  conversation       ConversationLog @relation(fields: [conversationId], references: [conversationId], onDelete: Cascade)
  
  @@index([conversationId])
  @@index([timestamp])
}
```

**Update CaregiverProfile:**

```prisma
model CaregiverProfile {
  // ... existing fields ...
  
  // Add relationship
  conversations   ConversationLog[]
  
  // Keep for backward compatibility, but will migrate to ConversationLog
  conversationHistory String?  // JSON array of messages
}
```

**Benefits:**
- Full audit trail of every interaction
- Debug LLM behavior (see raw responses)
- Track which fields get extracted when
- Support multiple conversation sessions per profile
- Enable conversation replay for testing
- Analytics: extraction patterns, conversation length, field coverage

---

### Phase 2: Module Implementation

#### 2.1 lib/llm/interface.ts

**Purpose:** Pure LLM communication - no business logic, no database interaction

**Responsibilities:**
- Format prompts with system message + conversation history
- Call OpenAI API with structured output
- Parse and validate LLM responses
- Post-process responses (clean meta-references)
- Stream responses character-by-character

**Key Functions:**

```typescript
/**
 * Send message to LLM and get structured response
 * Returns full parsed response including message and extracted data
 */
export async function sendToLLM(
  messages: Message[],
  systemPrompt: string
): Promise<Result<AgentResponse>>

/**
 * Stream LLM response for real-time UI updates
 * Yields content chunks and final extraction event
 */
export async function* streamLLMResponse(
  messages: Message[],
  systemPrompt: string
): AsyncGenerator<StreamChunk>

/**
 * Clean meta-references from LLM responses
 * Remove phrases like "based on the extracted data", "I've saved", etc.
 */
export function cleanResponse(response: string): string

/**
 * Format conversation history for LLM context
 * Apply sliding window if conversation is too long
 */
export function formatConversationContext(
  messages: ConversationMessage[],
  maxMessages?: number
): Message[]
```

**Error Handling:**
```typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string; details?: any }
```

**Example Usage:**
```typescript
const result = await sendToLLM(messages, SYSTEM_PROMPT)
if (!result.success) {
  // Handle gracefully - return error to user
  return { error: result.error }
}
// Use result.data.message and result.data.extractedData
```

---

#### 2.2 lib/conversation/manager.ts

**Purpose:** Manage conversation lifecycle and persistence

**Responsibilities:**
- Create new conversations
- Load conversation history
- Save messages with full context
- End conversations
- Migrate old data formats
- Handle conversation status transitions

**Key Functions:**

```typescript
/**
 * Get or create active conversation for a profile
 */
export async function getActiveConversation(
  profileId: string
): Promise<Result<ConversationLog>>

/**
 * Create a new conversation session
 */
export async function createConversation(
  profileId: string
): Promise<Result<ConversationLog>>

/**
 * Add a message exchange to the conversation
 * Logs user input, agent response, raw LLM output, and extracted data
 */
export async function addMessageToConversation(
  conversationId: string,
  data: {
    userMessage: string
    agentResponse: string
    llmRawResponse: string
    extractedData?: any
    extractedFields?: string[]
  }
): Promise<Result<ConversationMessage>>

/**
 * Load conversation history for LLM context
 * Returns messages formatted for LLM consumption
 */
export async function getConversationHistory(
  conversationId: string,
  maxMessages?: number
): Promise<Result<Message[]>>

/**
 * Mark conversation as completed
 */
export async function endConversation(
  conversationId: string
): Promise<Result<void>>

/**
 * Get conversation statistics
 */
export async function getConversationStats(
  conversationId: string
): Promise<Result<ConversationStats>>

/**
 * Migrate old conversation format to new structure
 * Handles backward compatibility
 */
export async function migrateOldFormat(
  profileId: string
): Promise<Result<void>>
```

**Data Structures:**

```typescript
interface ConversationStats {
  messageCount: number
  fieldsExtracted: string[]
  fieldsCovered: number
  totalFields: number
  completionPercentage: number
  duration: number // milliseconds
  averageResponseTime: number
}

interface ConversationLog {
  id: string
  profileId: string
  conversationId: string
  status: 'active' | 'completed' | 'abandoned'
  startedAt: Date
  lastUpdatedAt: Date
  version: number
  messages: ConversationMessage[]
}
```

**Example Usage:**
```typescript
// Start or resume conversation
const result = await getActiveConversation(profileId)
if (!result.success) {
  return handleError(result.error)
}

const conversation = result.data

// Add message after each exchange
await addMessageToConversation(conversation.conversationId, {
  userMessage: "I'm in Denver",
  agentResponse: "Great! I've noted Denver...",
  llmRawResponse: JSON.stringify(fullLLMResponse),
  extractedData: { location: "Denver" },
  extractedFields: ["location"]
})
```

---

#### 2.3 lib/tools/extractor.ts

**Purpose:** Extract and validate profile data from LLM responses

**Responsibilities:**
- Parse extracted data from LLM
- Validate against Zod schemas
- Transform data for database storage
- Return errors as values (not exceptions)
- Track which fields were extracted

**Key Functions:**

```typescript
/**
 * Extract and validate profile data
 * Returns validated data or descriptive error
 */
export function extractProfileData(
  rawData: any
): Result<{
  data: Partial<CaregiverProfile>
  fields: string[]
}>

/**
 * Merge extracted data with existing profile
 * Only updates non-null fields
 */
export function mergeProfileData(
  existing: CaregiverProfile,
  extracted: Partial<CaregiverProfile>
): CaregiverProfile

/**
 * Convert profile data to database format
 * Handles JSON serialization for arrays/objects
 */
export function toDBFormat(
  data: Partial<CaregiverProfile>
): Record<string, any>

/**
 * Parse database format back to typed objects
 */
export function fromDBFormat(
  dbData: any
): Partial<CaregiverProfile>

/**
 * Get list of non-null fields in profile
 */
export function getExtractedFields(
  data: Partial<CaregiverProfile>
): string[]
```

**Example Usage:**
```typescript
const result = extractProfileData(llmResponse.extractedData)
if (!result.success) {
  // Log error but continue conversation
  console.error('Extraction failed:', result.error)
  return { extracted: null, error: result.error }
}

const { data, fields } = result.data
// data: validated profile fields
// fields: ["location", "languages"] - what was extracted
```

---

#### 2.4 lib/tools/validator.ts

**Purpose:** Validate individual profile fields

**Responsibilities:**
- Field-specific validation logic
- Format checking (phone, email, etc.)
- Range validation (hourly rate, years of experience)
- Return helpful error messages

**Key Functions:**

```typescript
/**
 * Validate a single profile field
 */
export function validateField(
  fieldName: string,
  value: any
): Result<any>

/**
 * Validate location format
 */
export function validateLocation(location: string): Result<string>

/**
 * Validate hourly rate format and range
 */
export function validateHourlyRate(rate: string): Result<string>

/**
 * Validate language codes
 */
export function validateLanguages(languages: string[]): Result<string[]>

/**
 * Get validation rules for a field
 */
export function getFieldValidation(
  fieldName: string
): ValidationRule | null
```

**Example Usage:**
```typescript
const result = validateField('hourlyRate', '$30/hour')
if (!result.success) {
  return {
    error: `Invalid hourly rate: ${result.error}`
  }
}
```

---

#### 2.5 lib/executor.ts

**Purpose:** Main orchestrator - coordinates between all modules

**Responsibilities:**
- Receive user message
- Load conversation context
- Call LLM interface
- Extract and validate data
- Update profile
- Save conversation log
- Stream response to client
- Handle errors gracefully

**Key Function:**

```typescript
/**
 * Process a user message and stream the response
 * This is the main entry point called by the API route
 */
export async function* executeConversationTurn(
  profileId: string,
  userMessage: string
): AsyncGenerator<ExecutionChunk> {
  // 1. Get or create active conversation
  const convResult = await getActiveConversation(profileId)
  if (!convResult.success) {
    yield { type: 'error', error: convResult.error }
    return
  }
  
  const conversation = convResult.data
  
  // 2. Load conversation history for context
  const historyResult = await getConversationHistory(
    conversation.conversationId
  )
  if (!historyResult.success) {
    yield { type: 'error', error: historyResult.error }
    return
  }
  
  const history = historyResult.data
  
  // 3. Add user message to history
  const messages = [...history, { role: 'user', content: userMessage }]
  
  // 4. Call LLM with context
  let fullResponse = ''
  let extractedData = null
  
  for await (const chunk of streamLLMResponse(messages, SYSTEM_PROMPT)) {
    if (chunk.type === 'content') {
      fullResponse += chunk.content
      yield { type: 'content', content: chunk.content }
    } else if (chunk.type === 'extraction') {
      extractedData = chunk.data
    } else if (chunk.type === 'error') {
      yield { type: 'error', error: chunk.error }
      return
    }
  }
  
  // 5. If data was extracted, validate and save
  let savedFields: string[] = []
  if (extractedData) {
    const extractResult = extractProfileData(extractedData)
    
    if (extractResult.success) {
      const { data, fields } = extractResult.data
      savedFields = fields
      
      // Convert to DB format
      const dbData = toDBFormat(data)
      
      // Update profile (only non-null fields)
      if (Object.keys(dbData).length > 0) {
        await prisma.caregiverProfile.update({
          where: { id: profileId },
          data: dbData
        })
        
        yield { type: 'extraction', data, fields }
      }
    } else {
      // Log extraction error but continue
      console.error('Extraction validation failed:', extractResult.error)
    }
  }
  
  // 6. Save conversation message with full context
  await addMessageToConversation(conversation.conversationId, {
    userMessage,
    agentResponse: fullResponse,
    llmRawResponse: JSON.stringify({
      message: fullResponse,
      extractedData
    }),
    extractedData: extractedData ? JSON.stringify(extractedData) : null,
    extractedFields: savedFields.length > 0 ? savedFields : null
  })
  
  // 7. Signal completion
  yield { type: 'done' }
}
```

**Stream Chunk Types:**
```typescript
type ExecutionChunk =
  | { type: 'content'; content: string }
  | { type: 'extraction'; data: any; fields: string[] }
  | { type: 'error'; error: string }
  | { type: 'done' }
```

**Example Usage:**
```typescript
// In API route
for await (const chunk of executeConversationTurn(profileId, userMessage)) {
  switch (chunk.type) {
    case 'content':
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      break
    case 'extraction':
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      break
    case 'error':
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      break
    case 'done':
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      break
  }
}
```

---

### Phase 3: Refactor API Route

#### app/api/chat/route.ts (Simplified)

**After Refactoring:**

```typescript
import { NextRequest } from 'next/server'
import { executeConversationTurn } from '@/lib/executor'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { message, profileId } = await req.json()

    // Validation
    if (!message || typeof message !== 'string') {
      return new Response('Invalid message', { status: 400 })
    }
    if (!profileId) {
      return new Response('Profile ID required', { status: 400 })
    }

    // Create stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Delegate to executor - it handles everything
          for await (const chunk of executeConversationTurn(profileId, message)) {
            const data = JSON.stringify(chunk)
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
          
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
```

**Reduction:** From 82 lines to ~40 lines  
**Responsibility:** Pure routing and streaming, no business logic

---

### Phase 4: CLI Management Tool

#### conversation-manager.ts

**Purpose:** Provide command-line access to conversation data for debugging and inspection

**Commands:**

```bash
# List all profiles with conversation counts
npm run cli list

# Show full conversation history
npm run cli show <conversationId>

# Show conversation statistics
npm run cli stats <conversationId>

# Export conversation to JSON
npm run cli export <conversationId> <filename>

# End active conversation
npm run cli end <conversationId>

# Show extraction analytics
npm run cli analytics
```

**Implementation:**

```typescript
#!/usr/bin/env node
import { program } from 'commander'
import { prisma } from './lib/db'
import { getConversationStats } from './lib/conversation/manager'
import { promises as fs } from 'fs'

program
  .name('conversation-manager')
  .description('CLI tool for managing and inspecting conversations')
  .version('1.0.0')

// List all profiles and conversations
program
  .command('list')
  .description('List all profiles with their conversations')
  .action(async () => {
    const profiles = await prisma.caregiverProfile.findMany({
      include: {
        conversations: {
          select: {
            conversationId: true,
            status: true,
            startedAt: true,
            _count: {
              select: { messages: true }
            }
          }
        }
      }
    })
    
    console.log(`\nTotal profiles: ${profiles.length}\n`)
    
    profiles.forEach(profile => {
      console.log(`Profile: ${profile.id}`)
      console.log(`  Location: ${profile.location || 'Not set'}`)
      console.log(`  Status: ${profile.status}`)
      console.log(`  Conversations: ${profile.conversations.length}`)
      
      profile.conversations.forEach(conv => {
        console.log(`    - ${conv.conversationId} (${conv.status})`)
        console.log(`      Messages: ${conv._count.messages}`)
        console.log(`      Started: ${conv.startedAt.toISOString()}`)
      })
      
      console.log()
    })
  })

// Show detailed conversation
program
  .command('show <conversationId>')
  .description('Display full conversation history')
  .action(async (conversationId: string) => {
    const conversation = await prisma.conversationLog.findUnique({
      where: { conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        },
        profile: true
      }
    })
    
    if (!conversation) {
      console.error('Conversation not found')
      process.exit(1)
    }
    
    console.log(`\nConversation: ${conversationId}`)
    console.log(`Profile: ${conversation.profile.id}`)
    console.log(`Status: ${conversation.status}`)
    console.log(`Started: ${conversation.startedAt}`)
    console.log(`Messages: ${conversation.messages.length}\n`)
    
    conversation.messages.forEach((msg, i) => {
      console.log(`--- Message ${i + 1} (${msg.timestamp}) ---`)
      console.log(`User: ${msg.userMessage}`)
      console.log(`Agent: ${msg.agentResponse}`)
      if (msg.extractedFields) {
        const fields = JSON.parse(msg.extractedFields)
        console.log(`Extracted: ${fields.join(', ')}`)
      }
      console.log()
    })
  })

// Show statistics
program
  .command('stats <conversationId>')
  .description('Show conversation statistics')
  .action(async (conversationId: string) => {
    const result = await getConversationStats(conversationId)
    
    if (!result.success) {
      console.error('Error:', result.error)
      process.exit(1)
    }
    
    const stats = result.data
    console.log(`\nConversation Statistics`)
    console.log(`----------------------`)
    console.log(`Messages: ${stats.messageCount}`)
    console.log(`Fields extracted: ${stats.fieldsCovered}/${stats.totalFields}`)
    console.log(`Completion: ${stats.completionPercentage}%`)
    console.log(`Duration: ${(stats.duration / 1000).toFixed(1)}s`)
    console.log(`Avg response time: ${(stats.averageResponseTime / 1000).toFixed(1)}s`)
    console.log(`\nExtracted fields:`)
    stats.fieldsExtracted.forEach(field => console.log(`  - ${field}`))
  })

// Export conversation
program
  .command('export <conversationId> <filename>')
  .description('Export conversation to JSON file')
  .action(async (conversationId: string, filename: string) => {
    const conversation = await prisma.conversationLog.findUnique({
      where: { conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        },
        profile: true
      }
    })
    
    if (!conversation) {
      console.error('Conversation not found')
      process.exit(1)
    }
    
    await fs.writeFile(
      filename,
      JSON.stringify(conversation, null, 2)
    )
    
    console.log(`Exported to ${filename}`)
  })

// End conversation
program
  .command('end <conversationId>')
  .description('Mark conversation as completed')
  .action(async (conversationId: string) => {
    await prisma.conversationLog.update({
      where: { conversationId },
      data: { status: 'completed' }
    })
    
    console.log('Conversation marked as completed')
  })

// Show analytics
program
  .command('analytics')
  .description('Show extraction analytics across all conversations')
  .action(async () => {
    const conversations = await prisma.conversationLog.findMany({
      include: {
        messages: true
      }
    })
    
    const fieldCounts: Record<string, number> = {}
    let totalMessages = 0
    
    conversations.forEach(conv => {
      totalMessages += conv.messages.length
      
      conv.messages.forEach(msg => {
        if (msg.extractedFields) {
          const fields = JSON.parse(msg.extractedFields)
          fields.forEach((field: string) => {
            fieldCounts[field] = (fieldCounts[field] || 0) + 1
          })
        }
      })
    })
    
    console.log(`\nExtraction Analytics`)
    console.log(`-------------------`)
    console.log(`Total conversations: ${conversations.length}`)
    console.log(`Total messages: ${totalMessages}`)
    console.log(`\nMost extracted fields:`)
    
    Object.entries(fieldCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([field, count]) => {
        console.log(`  ${field}: ${count} times`)
      })
  })

program.parse()
```

**Add to package.json:**
```json
{
  "scripts": {
    "cli": "tsx conversation-manager.ts"
  },
  "devDependencies": {
    "commander": "^11.1.0",
    "tsx": "^4.7.0"
  }
}
```

---

## Error Handling Strategy

### Errors as Values Pattern

**Before (throwing exceptions):**
```typescript
function parseData(input: any) {
  if (!input) {
    throw new Error('Input required')
  }
  const parsed = schema.parse(input) // Throws on invalid
  return parsed
}
```

**After (errors as values):**
```typescript
function parseData(input: any): Result<ParsedData> {
  if (!input) {
    return {
      success: false,
      error: 'Input is required to continue'
    }
  }
  
  try {
    const parsed = schema.parse(input)
    return { success: true, data: parsed }
  } catch (error) {
    return {
      success: false,
      error: 'Could not validate the data format. Please try again.'
    }
  }
}
```

**Benefits:**
- LLM can incorporate errors into natural responses
- Conversation continues even if one operation fails
- Users see helpful messages, not stack traces
- Errors are explicit in the type system

### Error Handling Checklist

- [ ] All tool functions return `Result<T>` type
- [ ] LLM interface handles API failures gracefully
- [ ] Conversation manager handles DB failures
- [ ] Executor catches and logs all errors
- [ ] API route has top-level error boundary
- [ ] Client handles stream errors with retry
- [ ] User sees friendly error messages

---

## Migration Strategy

### Database Migration

**Step 1: Create migration**
```bash
npx prisma migrate dev --name add_conversation_logging
```

**Step 2: Migrate existing data (optional)**
```typescript
// migration script
async function migrateExistingProfiles() {
  const profiles = await prisma.caregiverProfile.findMany({
    where: {
      conversationHistory: { not: null }
    }
  })
  
  for (const profile of profiles) {
    if (!profile.conversationHistory) continue
    
    // Parse old format
    const oldMessages = JSON.parse(profile.conversationHistory)
    
    // Create new conversation
    const conversation = await prisma.conversationLog.create({
      data: {
        profileId: profile.id,
        conversationId: `migrated-${profile.id}`,
        status: 'completed',
        startedAt: profile.createdAt,
        version: 1
      }
    })
    
    // Convert messages
    for (const msg of oldMessages) {
      await prisma.conversationMessage.create({
        data: {
          conversationId: conversation.conversationId,
          userMessage: msg.userMessage || '',
          agentResponse: msg.agentResponse || '',
          llmRawResponse: JSON.stringify(msg),
          timestamp: msg.timestamp || new Date()
        }
      })
    }
  }
}
```

### Code Migration

**Phase 1: Add new modules (non-breaking)**
- Create all new files
- Don't modify existing code yet
- Test new modules in isolation

**Phase 2: Switch API routes (breaking)**
- Update `/api/chat/route.ts` to use executor
- Deploy migration
- Keep old code for rollback

**Phase 3: Cleanup (after verification)**
- Remove or deprecate old `lib/agent.ts`
- Clean up unused imports
- Update documentation

---

## Testing Strategy

### Unit Tests (New)

```typescript
// lib/llm/__tests__/interface.test.ts
describe('LLM Interface', () => {
  test('formats conversation context correctly', () => {
    const messages = [...]
    const formatted = formatConversationContext(messages)
    expect(formatted).toHaveLength(messages.length)
  })
  
  test('cleans meta-references from responses', () => {
    const input = "Based on what you said, I've saved Denver"
    const cleaned = cleanResponse(input)
    expect(cleaned).not.toContain("I've saved")
  })
})

// lib/tools/__tests__/extractor.test.ts
describe('Data Extractor', () => {
  test('extracts valid profile data', () => {
    const result = extractProfileData({ location: 'Denver' })
    expect(result.success).toBe(true)
    expect(result.data.fields).toContain('location')
  })
  
  test('returns error for invalid data', () => {
    const result = extractProfileData({ hourlyRate: 'invalid' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('hourly rate')
  })
})

// lib/conversation/__tests__/manager.test.ts
describe('Conversation Manager', () => {
  test('creates new conversation', async () => {
    const result = await createConversation('test-profile')
    expect(result.success).toBe(true)
    expect(result.data.status).toBe('active')
  })
  
  test('adds message to conversation', async () => {
    const result = await addMessageToConversation(convId, {...})
    expect(result.success).toBe(true)
  })
})
```

### Integration Tests

```typescript
describe('Full Flow Integration', () => {
  test('processes user message end-to-end', async () => {
    const chunks = []
    for await (const chunk of executeConversationTurn(profileId, 'Hello')) {
      chunks.push(chunk)
    }
    
    expect(chunks).toContainEqual({ type: 'content', content: expect.any(String) })
    expect(chunks).toContainEqual({ type: 'done' })
  })
})
```

### Manual Testing with CLI

```bash
# Test conversation creation
npm run dev &
# Send some messages via UI

# Inspect with CLI
npm run cli list
npm run cli show <conversationId>
npm run cli stats <conversationId>

# Verify logging
npm run cli show <conversationId> | grep "Extracted"
```

---

## Implementation Timeline

### Day 1 (6-8 hours)

**Morning (3-4 hours):**
- [x] ✅ Create architecture refactor plan document
- [ ] Update Prisma schema with ConversationLog models
- [ ] Run migration
- [ ] Create lib/llm/interface.ts
- [ ] Create lib/conversation/manager.ts

**Afternoon (3-4 hours):**
- [ ] Create lib/tools/extractor.ts
- [ ] Create lib/tools/validator.ts
- [ ] Create lib/executor.ts
- [ ] Write unit tests for new modules

### Day 2 (2-4 hours)

**Morning (1-2 hours):**
- [ ] Refactor app/api/chat/route.ts
- [ ] Test refactored API route
- [ ] Fix any integration issues

**Afternoon (1-2 hours):**
- [ ] Create CLI tool (conversation-manager.ts)
- [ ] Test all CLI commands
- [ ] Update documentation
- [ ] Create commit

---

## Success Metrics

### Code Quality
- [ ] All modules have single responsibility
- [ ] No module exceeds 200 lines
- [ ] All functions have clear return types
- [ ] Error handling is consistent (Result<T>)
- [ ] Code is testable in isolation

### Observability
- [ ] Every conversation is logged
- [ ] Every extraction event is recorded
- [ ] LLM raw responses are saved
- [ ] Timestamps are tracked
- [ ] CLI tool provides full visibility

### Reliability
- [ ] No unhandled exceptions in production
- [ ] Errors are returned as values
- [ ] Conversation continues after errors
- [ ] Users see helpful error messages
- [ ] System recovers gracefully

### Maintainability
- [ ] Clear separation of concerns
- [ ] Easy to add new tools
- [ ] Easy to change LLM provider
- [ ] Easy to add new fields
- [ ] New developers can understand flow

---

## Rollback Plan

If refactoring causes issues:

1. **Immediate**: Revert API route changes, restore old agent.ts usage
2. **Short-term**: Keep new modules but disable conversation logging
3. **Long-term**: Iterate on issues, gradual re-enable

**Safeguards:**
- Keep old agent.ts intact during refactor
- Feature flag for conversation logging
- Database migration is non-destructive (adds tables, doesn't modify existing)
- CLI tool only reads data, never writes (except `end` command)

---

## Future Enhancements (Out of Scope)

These are NOT part of this refactor but enabled by it:

- [ ] Multi-agent coordination
- [ ] Tool chaining (plan multi-step sequences)
- [ ] Conversation replay for testing
- [ ] A/B testing different prompts
- [ ] Fine-tuning dataset export
- [ ] Real-time analytics dashboard
- [ ] Conversation branching
- [ ] Automated conversation quality scoring

---

## Relationship to Original Implementation Plan

This refactor is **Phase 6** - an enhancement to the completed implementation:

- **Phases 1-4** (Complete): Full working application with streaming, voice input, profile extraction
- **Phase 5** (Partial): Manual testing complete, documentation pending
- **Phase 6** (This Plan): Architecture enhancement for production readiness

**Key Differences from Original Plan:**
1. Original plan focused on feature delivery
2. This plan focuses on architecture and observability
3. Original plan got the app working
4. This plan makes it maintainable, debuggable, and production-ready

**Cross-References:**
- Database schema: See `implementation-plan.md` lines 69-114 for original schema concept
- Streaming: See `implementation-plan.md` lines 209-263 for streaming pattern implementation
- Tech stack: See `implementation-plan.md` lines 11-30 for technology decisions

---

## Conclusion

This refactoring applies battle-tested patterns from the Secret Agents architecture to enhance a working application:

1. **Separation of Concerns**: Clear module boundaries
2. **Rich Logging**: Full observability into interactions
3. **Error Handling**: Graceful degradation, no crashes

**Total Estimated Time:** 8-12 hours  
**Expected Benefits:**
- 3x easier to debug (full logging)
- 2x easier to test (isolated modules)
- 5x easier to extend (clear patterns)
- Zero conversation crashes (error handling)

**Status:** Ready for implementation approval

---

*Document created: November 6, 2025*  
*Updated: November 6, 2025 - Added project status and cross-references*  
*Next step: Begin Phase 1 - Database schema updates*
