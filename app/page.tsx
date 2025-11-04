'use client'

import { useEffect, useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import ProfilePreview from '@/components/ProfilePreview'

export default function Home() {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    // Create a new profile on page load
    fetch('/api/profile', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        setProfileId(data.id)
        setProfile(data)
      })
      .catch((error) => {
        console.error('Error creating profile:', error)
      })
  }, [])

  const refreshProfile = async () => {
    if (!profileId) return
    
    try {
      const res = await fetch(`/api/profile?id=${profileId}`)
      const data = await res.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  if (!profileId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 lg:border-r border-neutral-200">
        <ChatInterface 
          profileId={profileId} 
          onProfileUpdate={refreshProfile}
        />
      </div>
      <div className="lg:w-96 border-t lg:border-t-0 border-neutral-200">
        <ProfilePreview profile={profile} />
      </div>
    </div>
  )
}
