import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { agentResponseSchema, type AgentResponse } from '../schema'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
})

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string; details?: any }

export interface StreamChunk {
  type: 'content' | 'extraction' | 'error' | 'done'
  content?: string
  data?: any
  error?: string
}

/**
 * Send message to LLM and get structured response
 * Returns full parsed response including message and extracted data
 */
export async function sendToLLM(
  messages: Message[],
  systemPrompt: string
): Promise<Result<AgentResponse>> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      response_format: zodResponseFormat(agentResponseSchema, 'agent_response'),
      temperature: 0.8,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return {
        success: false,
        error: 'No response received from the AI. Please try again.'
      }
    }

    const parsed = JSON.parse(response) as AgentResponse
    
    // Clean the response message
    const cleanedMessage = cleanResponse(parsed.message)
    
    return {
      success: true,
      data: {
        message: cleanedMessage,
        extractedData: parsed.extractedData
      }
    }
  } catch (error: any) {
    console.error('LLM API Error:', error)
    return {
      success: false,
      error: 'Unable to process your message. Please try again.',
      details: error.message
    }
  }
}

/**
 * Stream LLM response for real-time UI updates
 * Yields content chunks and final extraction event
 */
export async function* streamLLMResponse(
  messages: Message[],
  systemPrompt: string
): AsyncGenerator<StreamChunk> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      response_format: zodResponseFormat(agentResponseSchema, 'agent_response'),
      temperature: 0.8,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      yield {
        type: 'error',
        error: 'No response received from the AI. Please try again.'
      }
      return
    }

    const parsed = JSON.parse(response) as AgentResponse
    
    // Clean the response message
    const message = cleanResponse(parsed.message)
    
    // Stream the message character by character for UI effect
    for (let i = 0; i < message.length; i++) {
      yield {
        type: 'content',
        content: message[i],
      }
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    // Yield extraction event if data was extracted
    if (parsed.extractedData) {
      yield {
        type: 'extraction',
        data: parsed.extractedData,
      }
    }

    yield { type: 'done' }
  } catch (error: any) {
    console.error('LLM Streaming Error:', error)
    yield {
      type: 'error',
      error: 'Unable to process your message. Please try again.'
    }
  }
}

/**
 * Clean meta-references from LLM responses
 * Remove phrases like "based on the extracted data", "I've saved", etc.
 */
export function cleanResponse(response: string): string {
  // Remove common meta-references that break immersion
  const metaPhrases = [
    /based on (what you (said|told me|mentioned)|the extracted data)/gi,
    /I've (saved|noted|recorded|stored|captured)/gi,
    /let me (save|note|record|store|capture)/gi,
  ]
  
  let cleaned = response
  for (const phrase of metaPhrases) {
    cleaned = cleaned.replace(phrase, '')
  }
  
  // Clean up any double spaces or leading punctuation
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim()
  cleaned = cleaned.replace(/^[,;.]\s*/g, '')
  
  return cleaned
}

/**
 * Format conversation history for LLM context
 * Apply sliding window if conversation is too long
 */
export function formatConversationContext(
  messages: Array<{ userMessage: string; agentResponse: string }>,
  maxMessages: number = 20
): Message[] {
  // Take the most recent messages if over the limit
  const recentMessages = messages.slice(-maxMessages)
  
  const formatted: Message[] = []
  for (const msg of recentMessages) {
    formatted.push({
      role: 'user',
      content: msg.userMessage
    })
    formatted.push({
      role: 'assistant',
      content: msg.agentResponse
    })
  }
  
  return formatted
}

/**
 * Transcribe audio using Whisper
 */
export async function transcribeAudio(audioFile: File): Promise<Result<string>> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    })

    return {
      success: true,
      data: transcription.text
    }
  } catch (error: any) {
    console.error('Transcription Error:', error)
    return {
      success: false,
      error: 'Unable to transcribe audio. Please try again.',
      details: error.message
    }
  }
}
