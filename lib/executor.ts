import { prisma } from './db'
import { SYSTEM_PROMPT } from './prompts'
import { streamLLMResponse } from './llm/interface'
import {
  getActiveConversation,
  addMessageToConversation,
  getConversationHistory,
} from './conversation/manager'
import { extractProfileData, toDBFormat } from './tools/extractor'

export interface ExecutionChunk {
  type: 'content' | 'extraction' | 'error' | 'done'
  content?: string
  data?: any
  fields?: string[]
  error?: string
}

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
    yield {
      type: 'error',
      error: convResult.error
    }
    return
  }

  const conversation = convResult.data

  // 2. Load conversation history for context (limit to 20 most recent messages)
  const historyResult = await getConversationHistory(
    conversation.conversationId,
    20
  )
  if (!historyResult.success) {
    yield {
      type: 'error',
      error: historyResult.error
    }
    return
  }

  const history = historyResult.data

  // 3. Add user message to history
  const messages = [...history, { role: 'user' as const, content: userMessage }]

  // 4. Call LLM with context
  let fullResponse = ''
  let extractedData = null

  try {
    for await (const chunk of streamLLMResponse(messages, SYSTEM_PROMPT)) {
      if (chunk.type === 'content' && chunk.content) {
        fullResponse += chunk.content
        yield {
          type: 'content',
          content: chunk.content
        }
      } else if (chunk.type === 'extraction' && chunk.data) {
        extractedData = chunk.data
      } else if (chunk.type === 'error') {
        yield {
          type: 'error',
          error: chunk.error || 'An error occurred'
        }
        return
      }
    }
  } catch (error: any) {
    console.error('Executor streaming error:', error)
    yield {
      type: 'error',
      error: 'Unable to process your message. Please try again.'
    }
    return
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
        try {
          await prisma.caregiverProfile.update({
            where: { id: profileId },
            data: dbData
          })

          yield {
            type: 'extraction',
            data,
            fields
          }
        } catch (error: any) {
          console.error('Error updating profile:', error)
          // Don't fail the whole conversation if profile update fails
        }
      }
    } else {
      // Log extraction error but continue conversation
      console.error('Extraction validation failed:', extractResult.error)
    }
  }

  // 6. Save conversation message with full context
  try {
    await addMessageToConversation(conversation.conversationId, {
      userMessage,
      agentResponse: fullResponse,
      llmRawResponse: JSON.stringify({
        message: fullResponse,
        extractedData
      }),
      extractedData: extractedData ? extractedData : undefined,
      extractedFields: savedFields.length > 0 ? savedFields : undefined
    })
  } catch (error: any) {
    console.error('Error saving conversation message:', error)
    // Don't fail the conversation if logging fails
  }

  // 7. Signal completion
  yield { type: 'done' }
}
