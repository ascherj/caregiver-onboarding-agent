import { prisma } from '../db'
import type { Message } from '../llm/interface'
import type { Result, ConversationStats } from './types'
import { ConversationLog, ConversationMessage } from '@prisma/client'

/**
 * Get or create active conversation for a profile
 */
export async function getActiveConversation(
  profileId: string
): Promise<Result<ConversationLog & { messages: ConversationMessage[] }>> {
  try {
    // Try to find an active conversation
    let conversation = await prisma.conversationLog.findFirst({
      where: {
        profileId,
        status: 'active'
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })

    // If no active conversation, create one
    if (!conversation) {
      const createResult = await createConversation(profileId)
      if (!createResult.success) {
        return createResult
      }
      conversation = createResult.data
    }

    return {
      success: true,
      data: conversation
    }
  } catch (error: any) {
    console.error('Error getting active conversation:', error)
    return {
      success: false,
      error: 'Unable to access conversation history',
      details: error.message
    }
  }
}

/**
 * Create a new conversation session
 */
export async function createConversation(
  profileId: string
): Promise<Result<ConversationLog & { messages: ConversationMessage[] }>> {
  try {
    const conversationId = `conv-${profileId}-${Date.now()}`
    
    const conversation = await prisma.conversationLog.create({
      data: {
        profileId,
        conversationId,
        status: 'active',
        version: 1
      },
      include: {
        messages: true
      }
    })

    return {
      success: true,
      data: conversation
    }
  } catch (error: any) {
    console.error('Error creating conversation:', error)
    return {
      success: false,
      error: 'Unable to start a new conversation',
      details: error.message
    }
  }
}

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
): Promise<Result<ConversationMessage>> {
  try {
    const message = await prisma.conversationMessage.create({
      data: {
        conversationId,
        userMessage: data.userMessage,
        agentResponse: data.agentResponse,
        llmRawResponse: data.llmRawResponse,
        extractedData: data.extractedData ? JSON.stringify(data.extractedData) : null,
        extractedFields: data.extractedFields && data.extractedFields.length > 0
          ? JSON.stringify(data.extractedFields)
          : null
      }
    })

    return {
      success: true,
      data: message
    }
  } catch (error: any) {
    console.error('Error adding message to conversation:', error)
    return {
      success: false,
      error: 'Unable to save conversation message',
      details: error.message
    }
  }
}

/**
 * Load conversation history for LLM context
 * Returns messages formatted for LLM consumption
 * Implements sliding window to keep most recent messages
 */
export async function getConversationHistory(
  conversationId: string,
  maxMessages: number = 20
): Promise<Result<Message[]>> {
  try {
    // Fetch all messages, then slice to get most recent
    const allMessages = await prisma.conversationMessage.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' }
    })

    // Apply sliding window - keep most recent maxMessages
    const recentMessages = allMessages.slice(-maxMessages)

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

    return {
      success: true,
      data: formatted
    }
  } catch (error: any) {
    console.error('Error getting conversation history:', error)
    return {
      success: false,
      error: 'Unable to load conversation history',
      details: error.message
    }
  }
}

/**
 * Mark conversation as completed
 */
export async function endConversation(
  conversationId: string
): Promise<Result<void>> {
  try {
    await prisma.conversationLog.update({
      where: { conversationId },
      data: { status: 'completed' }
    })

    return { success: true, data: undefined }
  } catch (error: any) {
    console.error('Error ending conversation:', error)
    return {
      success: false,
      error: 'Unable to end conversation',
      details: error.message
    }
  }
}

/**
 * Get conversation statistics
 */
export async function getConversationStats(
  conversationId: string
): Promise<Result<ConversationStats>> {
  try {
    const conversation = await prisma.conversationLog.findUnique({
      where: { conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })

    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found'
      }
    }

    // Calculate statistics
    const messageCount = conversation.messages.length
    const fieldsExtractedSet = new Set<string>()
    
    conversation.messages.forEach(msg => {
      if (msg.extractedFields) {
        try {
          const fields = JSON.parse(msg.extractedFields) as string[]
          fields.forEach(field => fieldsExtractedSet.add(field))
        } catch (e) {
          // Ignore parse errors
        }
      }
    })

    const fieldsExtracted = Array.from(fieldsExtractedSet)
    const fieldsCovered = fieldsExtracted.length
    
    // Total possible fields from schema (approximate)
    const totalFields = 23
    const completionPercentage = Math.round((fieldsCovered / totalFields) * 100)

    // Calculate duration
    const startTime = conversation.startedAt.getTime()
    const endTime = conversation.lastUpdatedAt.getTime()
    const duration = endTime - startTime

    // Calculate average response time (time between messages)
    let totalResponseTime = 0
    for (let i = 1; i < conversation.messages.length; i++) {
      const prevTime = conversation.messages[i - 1].timestamp.getTime()
      const currTime = conversation.messages[i].timestamp.getTime()
      totalResponseTime += (currTime - prevTime)
    }
    const averageResponseTime = messageCount > 1 
      ? totalResponseTime / (messageCount - 1)
      : 0

    return {
      success: true,
      data: {
        messageCount,
        fieldsExtracted,
        fieldsCovered,
        totalFields,
        completionPercentage,
        duration,
        averageResponseTime
      }
    }
  } catch (error: any) {
    console.error('Error getting conversation stats:', error)
    return {
      success: false,
      error: 'Unable to calculate conversation statistics',
      details: error.message
    }
  }
}
