import OpenAI from 'openai'
import { SYSTEM_PROMPT } from './prompts'
import { updateCaregiverProfileTool } from './schema'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
})

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function* streamChatResponse(
  messages: Message[],
  onFunctionCall?: (args: any) => Promise<void>
) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    tools: [updateCaregiverProfileTool],
    stream: true,
    temperature: 0.8,
  })

  let functionCallBuffer = {
    id: '',
    name: '',
    arguments: '',
  }

  let hasContent = false

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta

    if (!delta) continue

    if (delta.content) {
      hasContent = true
      yield {
        type: 'content' as const,
        content: delta.content,
      }
    }

    if (delta.tool_calls) {
      const toolCall = delta.tool_calls[0]
      
      if (toolCall.id) {
        functionCallBuffer.id = toolCall.id
      }
      
      if (toolCall.function?.name) {
        functionCallBuffer.name = toolCall.function.name
      }
      
      if (toolCall.function?.arguments) {
        functionCallBuffer.arguments += toolCall.function.arguments
      }
    }

    if (chunk.choices[0]?.finish_reason === 'tool_calls') {
      if (functionCallBuffer.name && functionCallBuffer.arguments) {
        try {
          const args = JSON.parse(functionCallBuffer.arguments)
          if (onFunctionCall) {
            await onFunctionCall(args)
          }
          yield {
            type: 'function_call' as const,
            name: functionCallBuffer.name,
            arguments: args,
          }
        } catch (error) {
          console.error('Error parsing function arguments:', error)
        }
      }
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
