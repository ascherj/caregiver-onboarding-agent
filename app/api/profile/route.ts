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

    // Parse JSON fields back to objects/arrays
    const parsed = {
      ...profile,
      languages: safeJsonParse(profile.languages, null),
      careTypes: safeJsonParse(profile.careTypes, null),
      qualifications: safeJsonParse(profile.qualifications, null),
      yearsOfExperience: safeJsonParse(profile.yearsOfExperience, null),
      preferredAgeGroups: safeJsonParse(profile.preferredAgeGroups, null),
      responsibilities: safeJsonParse(profile.responsibilities, null),
      dietaryPreferences: safeJsonParse(profile.dietaryPreferences, null),
      benefitsRequired: safeJsonParse(profile.benefitsRequired, null),
      conversationHistory: safeJsonParse(profile.conversationHistory, null),
    }

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
