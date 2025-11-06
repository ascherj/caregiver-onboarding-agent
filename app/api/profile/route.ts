import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Profile ID required' },
        { status: 400 }
      )
    }

    const profile = await prisma.caregiverProfile.findUnique({
      where: { id },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Helper to safely parse JSON fields
    const safeJsonParse = (value: string | null, defaultValue: any) => {
      if (!value || value === 'null' || value === ':null' || value === '/' || value === '.' || value.trim() === '') return defaultValue
      try {
        const parsed = JSON.parse(value)
        // Filter out null values from arrays
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(v => v !== null && v !== undefined && v !== 'null')
          return filtered.length > 0 ? filtered : defaultValue
        }
        return parsed
      } catch {
        return defaultValue
      }
    }

    // Parse JSON fields back to objects/arrays and filter out nulls
    const parsed: any = {
      id: profile.id,
      status: profile.status,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    }

    // Only include non-null, non-empty, non-placeholder fields
    const isValidValue = (val: any) => {
      if (!val) return false
      if (typeof val !== 'string') return true
      return val !== '/' && val !== '.' && val !== ':null' && val !== 'null' && val.trim() !== ''
    }

    if (isValidValue(profile.location)) parsed.location = profile.location
    if (isValidValue(profile.languages)) parsed.languages = safeJsonParse(profile.languages, null)
    if (isValidValue(profile.careTypes)) parsed.careTypes = safeJsonParse(profile.careTypes, null)
    if (isValidValue(profile.hourlyRate)) parsed.hourlyRate = profile.hourlyRate
    if (isValidValue(profile.qualifications)) parsed.qualifications = safeJsonParse(profile.qualifications, null)
    if (isValidValue(profile.startDate)) parsed.startDate = profile.startDate
    if (isValidValue(profile.generalAvailability)) parsed.generalAvailability = profile.generalAvailability
    if (isValidValue(profile.yearsOfExperience)) parsed.yearsOfExperience = safeJsonParse(profile.yearsOfExperience, null)
    if (isValidValue(profile.weeklyHours)) parsed.weeklyHours = profile.weeklyHours
    if (isValidValue(profile.preferredAgeGroups)) parsed.preferredAgeGroups = safeJsonParse(profile.preferredAgeGroups, null)
    if (isValidValue(profile.responsibilities)) parsed.responsibilities = safeJsonParse(profile.responsibilities, null)
    if (isValidValue(profile.commuteDistance)) parsed.commuteDistance = profile.commuteDistance
    if (isValidValue(profile.commuteType)) parsed.commuteType = profile.commuteType
    if (isValidValue(profile.willDriveChildren)) parsed.willDriveChildren = profile.willDriveChildren
    if (isValidValue(profile.accessibilityNeeds)) parsed.accessibilityNeeds = profile.accessibilityNeeds
    if (isValidValue(profile.dietaryPreferences)) parsed.dietaryPreferences = safeJsonParse(profile.dietaryPreferences, null)
    if (isValidValue(profile.additionalChildRate)) parsed.additionalChildRate = profile.additionalChildRate
    if (isValidValue(profile.payrollRequired)) parsed.payrollRequired = profile.payrollRequired
    if (isValidValue(profile.benefitsRequired)) parsed.benefitsRequired = safeJsonParse(profile.benefitsRequired, null)
    if (isValidValue(profile.profilePictureUrl)) parsed.profilePictureUrl = profile.profilePictureUrl
    if (isValidValue(profile.conversationHistory)) parsed.conversationHistory = safeJsonParse(profile.conversationHistory, null)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await prisma.caregiverProfile.create({
      data: {
        status: 'in_progress',
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}
