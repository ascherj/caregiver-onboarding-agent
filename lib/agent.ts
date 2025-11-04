import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { SYSTEM_PROMPT } from './prompts'
import { agentResponseSchema } from './schema'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
})

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function* streamChatResponse(
  messages: Message[],
  onDataExtracted?: (data: any) => Promise<void>
) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    response_format: zodResponseFormat(agentResponseSchema, 'agent_response'),
    temperature: 0.8,
  })

  const response = completion.choices[0]?.message?.content

  if (!response) {
    throw new Error('No response from model')
  }

  const parsed = JSON.parse(response)
  
  // Extract and save data if present
  if (parsed.extractedData && onDataExtracted) {
    await onDataExtracted(parsed.extractedData)
  }

  // Stream the message character by character for UI effect
  const message = parsed.message || ''
  for (let i = 0; i < message.length; i++) {
    yield {
      type: 'content' as const,
      content: message[i],
    }
    // Small delay to simulate streaming
    await new Promise(resolve => setTimeout(resolve, 10))
  }

  // Yield extraction event if data was extracted
  if (parsed.extractedData) {
    yield {
      type: 'extraction' as const,
      data: parsed.extractedData,
    }
  }
}

export async function transcribeAudio(audioFile: File): Promise<string> {
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  })

  return transcription.text
}
