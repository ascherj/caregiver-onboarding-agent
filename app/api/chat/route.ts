import { NextRequest } from 'next/server'
import { streamChatResponse, Message } from '@/lib/agent'
import { prisma } from '@/lib/db'
import { caregiverProfileSchema } from '@/lib/schema'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { messages, profileId } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages', { status: 400 })
    }

    if (!profileId) {
      return new Response('Profile ID required', { status: 400 })
    }

    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamChatResponse(
            messages,
            async (args) => {
              // Function call - update profile in database
              try {
                const validated = caregiverProfileSchema.parse(args)
                
                // Convert arrays and objects to JSON strings for SQLite
                const dbData: any = {}
                for (const [key, value] of Object.entries(validated)) {
                  if (value !== undefined) {
                    if (Array.isArray(value) || typeof value === 'object') {
                      dbData[key] = JSON.stringify(value)
                    } else {
                      dbData[key] = value
                    }
                  }
                }

                await prisma.caregiverProfile.update({
                  where: { id: profileId },
                  data: dbData,
                })
              } catch (error) {
                console.error('Error updating profile:', error)
              }
            }
          )) {
            const data = JSON.stringify(chunk)
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
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
