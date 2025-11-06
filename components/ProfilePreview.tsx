interface ProfilePreviewProps {
  profile: any
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {
  if (!profile) {
    return (
      <div className="p-6">
        <div className="text-neutral-500">Loading profile...</div>
      </div>
    )
  }

  const renderField = (label: string, value: any) => {
    // Filter out null, undefined, empty arrays, empty objects, and placeholder values
    if (value === null || value === undefined || value === 'null' || value === ':null' || value === '/' || value === '.') return null
    if (Array.isArray(value) && value.length === 0) return null
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return null
    if (typeof value === 'string' && (value.trim() === '' || value.trim() === 'null' || value.includes(',null'))) return null

    let displayValue = value
    if (Array.isArray(value)) {
      // Filter out null values from arrays before joining
      const filtered = value.filter(v => v !== null && v !== undefined && v !== 'null')
      if (filtered.length === 0) return null
      displayValue = filtered.join(', ')
    } else if (typeof value === 'object' && value !== null) {
      displayValue = Object.entries(value)
        .filter(([k, v]) => v !== null && v !== undefined && v !== 'null')
        .map(([k, v]) => `${k}: ${v} years`)
        .join(', ')
      if (displayValue === '') return null
    }

    return (
      <div key={label} className="mb-3">
        <dt className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
          {label}
        </dt>
        <dd className="text-sm text-neutral-900">{displayValue}</dd>
      </div>
    )
  }

  const fields = [
    { label: 'Location', key: 'location' },
    { label: 'Languages', key: 'languages' },
    { label: 'Care Types', key: 'careTypes' },
    { label: 'Hourly Rate', key: 'hourlyRate' },
    { label: 'Qualifications', key: 'qualifications' },
    { label: 'Start Date', key: 'startDate' },
    { label: 'Availability', key: 'generalAvailability' },
    { label: 'Years of Experience', key: 'yearsOfExperience' },
    { label: 'Weekly Hours', key: 'weeklyHours' },
    { label: 'Preferred Age Groups', key: 'preferredAgeGroups' },
    { label: 'Responsibilities', key: 'responsibilities' },
    { label: 'Commute Distance', key: 'commuteDistance' },
    { label: 'Commute Type', key: 'commuteType' },
    { label: 'Will Drive Children', key: 'willDriveChildren' },
    { label: 'Accessibility Needs', key: 'accessibilityNeeds' },
    { label: 'Dietary Preferences', key: 'dietaryPreferences' },
    { label: 'Additional Child Rate', key: 'additionalChildRate' },
    { label: 'Payroll Required', key: 'payrollRequired' },
    { label: 'Benefits Required', key: 'benefitsRequired' },
  ]

  const filledCount = fields.filter(f => {
    const value = profile[f.key]
    if (value === null || value === undefined || value === 'null' || value === ':null' || value === '/' || value === '.') return false
    if (typeof value === 'string' && (value.trim() === '' || value.trim() === 'null' || value.includes(',null'))) return false
    if (Array.isArray(value)) {
      const filtered = value.filter(v => v !== null && v !== undefined && v !== 'null')
      return filtered.length > 0
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      const validEntries = Object.entries(value).filter(([k, v]) => v !== null && v !== undefined && v !== 'null')
      return validEntries.length > 0
    }
    return true
  }).length

  const completionPercent = Math.round((filledCount / fields.length) * 100)

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4">
        <h2 className="text-lg font-bold text-neutral-900">Your Profile</h2>
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span>Completion</span>
            <span>{completionPercent}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-coral-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <dl className="space-y-1">
          {fields.map(field => renderField(field.label, profile[field.key]))}
          {filledCount === 0 && (
            <div className="text-sm text-neutral-500 italic">
              Your information will appear here as you chat with the agent.
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
