import { z } from 'zod'

export const caregiverProfileSchema = z.object({
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  careTypes: z.array(z.string()).optional(),
  hourlyRate: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  generalAvailability: z.string().optional(),
  yearsOfExperience: z.record(z.number()).optional(),
  weeklyHours: z.string().optional(),
  preferredAgeGroups: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  commuteDistance: z.string().optional(),
  commuteType: z.string().optional(),
  willDriveChildren: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  additionalChildRate: z.string().optional(),
  payrollRequired: z.string().optional(),
  benefitsRequired: z.array(z.string()).optional(),
  profilePictureUrl: z.string().optional(),
})

export type CaregiverProfile = z.infer<typeof caregiverProfileSchema>

export const updateCaregiverProfileTool = {
  type: "function" as const,
  function: {
    name: "update_caregiver_profile",
    description: "Extract and update caregiver profile information from the conversation. Call this whenever the user provides information that should be stored in their profile.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Geographic location (city, state, or general area)"
        },
        languages: {
          type: "array",
          items: { type: "string" },
          description: "Languages spoken"
        },
        careTypes: {
          type: "array",
          items: { type: "string" },
          description: "Types of care provided (e.g., infant care, toddler care, after-school care)"
        },
        hourlyRate: {
          type: "string",
          description: "Hourly rate with currency (e.g., $25/hour)"
        },
        qualifications: {
          type: "array",
          items: { type: "string" },
          description: "Certifications, degrees, training (e.g., CPR, First Aid, CDA)"
        },
        startDate: {
          type: "string",
          description: "Availability start date"
        },
        generalAvailability: {
          type: "string",
          description: "Free-form schedule description"
        },
        yearsOfExperience: {
          type: "object",
          additionalProperties: { type: "number" },
          description: "Years of experience breakdown by care type (e.g., {\"infant\": 5, \"toddler\": 3})"
        },
        weeklyHours: {
          type: "string",
          description: "Desired hours per week"
        },
        preferredAgeGroups: {
          type: "array",
          items: { type: "string" },
          description: "Preferred age ranges"
        },
        responsibilities: {
          type: "array",
          items: { type: "string" },
          description: "Specific duties willing to do"
        },
        commuteDistance: {
          type: "string",
          description: "Maximum commute distance"
        },
        commuteType: {
          type: "string",
          description: "Transportation method"
        },
        willDriveChildren: {
          type: "string",
          description: "Willing to drive children (Yes/No/Maybe)"
        },
        accessibilityNeeds: {
          type: "string",
          description: "Any accessibility requirements"
        },
        dietaryPreferences: {
          type: "array",
          items: { type: "string" },
          description: "Dietary restrictions/preferences"
        },
        additionalChildRate: {
          type: "string",
          description: "Rate for additional children"
        },
        payrollRequired: {
          type: "string",
          description: "Payroll service needed"
        },
        benefitsRequired: {
          type: "array",
          items: { type: "string" },
          description: "Desired benefits"
        },
        profilePictureUrl: {
          type: "string",
          description: "Profile photo URL"
        }
      }
    }
  }
}
