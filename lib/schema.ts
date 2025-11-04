import { z } from 'zod'

export const caregiverProfileSchema = z.object({
  location: z.string().nullable().optional(),
  languages: z.array(z.string()).nullable().optional(),
  careTypes: z.array(z.string()).nullable().optional(),
  hourlyRate: z.string().nullable().optional(),
  qualifications: z.array(z.string()).nullable().optional(),
  startDate: z.string().nullable().optional(),
  generalAvailability: z.string().nullable().optional(),
  yearsOfExperience: z.record(z.number()).nullable().optional(),
  weeklyHours: z.string().nullable().optional(),
  preferredAgeGroups: z.array(z.string()).nullable().optional(),
  responsibilities: z.array(z.string()).nullable().optional(),
  commuteDistance: z.string().nullable().optional(),
  commuteType: z.string().nullable().optional(),
  willDriveChildren: z.string().nullable().optional(),
  accessibilityNeeds: z.string().nullable().optional(),
  dietaryPreferences: z.array(z.string()).nullable().optional(),
  additionalChildRate: z.string().nullable().optional(),
  payrollRequired: z.string().nullable().optional(),
  benefitsRequired: z.array(z.string()).nullable().optional(),
  profilePictureUrl: z.string().nullable().optional(),
})

export const agentResponseSchema = z.object({
  message: z.string().describe('Your conversational response to the user. Acknowledge what you extracted and ask the next question.'),
  extractedData: caregiverProfileSchema.describe('Profile data extracted from the user\'s message. Only include fields the user mentioned. Use null for fields not mentioned.')
})

export type CaregiverProfile = z.infer<typeof caregiverProfileSchema>
export type AgentResponse = z.infer<typeof agentResponseSchema>
