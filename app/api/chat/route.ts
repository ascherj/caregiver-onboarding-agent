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
            try {
              const data = JSON.stringify(chunk)
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            } catch (enqueueError) {
              console.error('Error enqueueing chunk:', enqueueError)
              break
            }
          }

          // Only close if not already closed
          try {
            controller.close()
          } catch (closeError) {
            console.error('Controller already closed:', closeError)
          }
        } catch (error) {
          console.error('Stream error:', error)
          try {
            controller.error(error)
          } catch (errorError) {
            console.error('Error sending error to controller:', errorError)
          }
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
