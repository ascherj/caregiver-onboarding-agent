import { NextRequest, NextResponse } from 'next/server'
import { transcribeAudio } from '@/lib/agent'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Check file size (60 seconds at reasonable quality ~= 1-2MB)
    const maxSize = 10 * 1024 * 1024 // 10MB to be safe
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Audio file too large (max 10MB)' },
        { status: 400 }
      )
    }

    const text = await transcribeAudio(audioFile)

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}
