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

    // Parse JSON fields back to objects/arrays
    const parsed = {
      ...profile,
      languages: profile.languages ? JSON.parse(profile.languages) : [],
      careTypes: profile.careTypes ? JSON.parse(profile.careTypes) : [],
      qualifications: profile.qualifications ? JSON.parse(profile.qualifications) : [],
      yearsOfExperience: profile.yearsOfExperience ? JSON.parse(profile.yearsOfExperience) : {},
      preferredAgeGroups: profile.preferredAgeGroups ? JSON.parse(profile.preferredAgeGroups) : [],
      responsibilities: profile.responsibilities ? JSON.parse(profile.responsibilities) : [],
      dietaryPreferences: profile.dietaryPreferences ? JSON.parse(profile.dietaryPreferences) : [],
      benefitsRequired: profile.benefitsRequired ? JSON.parse(profile.benefitsRequired) : [],
      conversationHistory: profile.conversationHistory ? JSON.parse(profile.conversationHistory) : [],
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
