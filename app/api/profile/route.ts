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
      if (!value || value === 'null') return defaultValue
      try {
        return JSON.parse(value)
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

    // Only include non-null fields
    if (profile.location) parsed.location = profile.location
    if (profile.languages) parsed.languages = safeJsonParse(profile.languages, null)
    if (profile.careTypes) parsed.careTypes = safeJsonParse(profile.careTypes, null)
    if (profile.hourlyRate) parsed.hourlyRate = profile.hourlyRate
    if (profile.qualifications) parsed.qualifications = safeJsonParse(profile.qualifications, null)
    if (profile.startDate) parsed.startDate = profile.startDate
    if (profile.generalAvailability) parsed.generalAvailability = profile.generalAvailability
    if (profile.yearsOfExperience) parsed.yearsOfExperience = safeJsonParse(profile.yearsOfExperience, null)
    if (profile.weeklyHours) parsed.weeklyHours = profile.weeklyHours
    if (profile.preferredAgeGroups) parsed.preferredAgeGroups = safeJsonParse(profile.preferredAgeGroups, null)
    if (profile.responsibilities) parsed.responsibilities = safeJsonParse(profile.responsibilities, null)
    if (profile.commuteDistance) parsed.commuteDistance = profile.commuteDistance
    if (profile.commuteType) parsed.commuteType = profile.commuteType
    if (profile.willDriveChildren) parsed.willDriveChildren = profile.willDriveChildren
    if (profile.accessibilityNeeds) parsed.accessibilityNeeds = profile.accessibilityNeeds
    if (profile.dietaryPreferences) parsed.dietaryPreferences = safeJsonParse(profile.dietaryPreferences, null)
    if (profile.additionalChildRate) parsed.additionalChildRate = profile.additionalChildRate
    if (profile.payrollRequired) parsed.payrollRequired = profile.payrollRequired
    if (profile.benefitsRequired) parsed.benefitsRequired = safeJsonParse(profile.benefitsRequired, null)
    if (profile.profilePictureUrl) parsed.profilePictureUrl = profile.profilePictureUrl
    if (profile.conversationHistory) parsed.conversationHistory = safeJsonParse(profile.conversationHistory, null)

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
