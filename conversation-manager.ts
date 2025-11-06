#!/usr/bin/env node

import { Command } from 'commander'
import { prisma } from './lib/db'
import { getConversationStats } from './lib/conversation/manager'
import { promises as fs } from 'fs'

const program = new Command()

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
    
    await prisma.$disconnect()
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
      await prisma.$disconnect()
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
        try {
          const fields = JSON.parse(msg.extractedFields)
          console.log(`Extracted: ${fields.join(', ')}`)
        } catch (e) {
          // Ignore parse errors
        }
      }
      console.log()
    })
    
    await prisma.$disconnect()
  })

// Show statistics
program
  .command('stats <conversationId>')
  .description('Show conversation statistics')
  .action(async (conversationId: string) => {
    const result = await getConversationStats(conversationId)
    
    if (!result.success) {
      console.error('Error:', result.error)
      await prisma.$disconnect()
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
    
    await prisma.$disconnect()
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
      await prisma.$disconnect()
      process.exit(1)
    }
    
    await fs.writeFile(
      filename,
      JSON.stringify(conversation, null, 2)
    )
    
    console.log(`Exported to ${filename}`)
    await prisma.$disconnect()
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
    await prisma.$disconnect()
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
          try {
            const fields = JSON.parse(msg.extractedFields)
            fields.forEach((field: string) => {
              fieldCounts[field] = (fieldCounts[field] || 0) + 1
            })
          } catch (e) {
            // Ignore parse errors
          }
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
    
    await prisma.$disconnect()
  })

program.parse(process.argv)
