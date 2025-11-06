import { caregiverProfileSchema, type CaregiverProfile } from '../schema'
import type { Result, ExtractionResult } from './types'

/**
 * Extract and validate profile data
 * Returns validated data or descriptive error
 */
export function extractProfileData(
  rawData: any
): Result<ExtractionResult> {
  try {
    // Validate against schema
    const validated = caregiverProfileSchema.parse(rawData)
    
    // Get list of non-null fields that were extracted
    const fields = getExtractedFields(validated)
    
    // Only include non-null fields in the result
    const data: Partial<CaregiverProfile> = {}
    for (const field of fields) {
      const key = field as keyof CaregiverProfile
      ;(data as any)[key] = validated[key]
    }
    
    return {
      success: true,
      data: {
        data,
        fields
      }
    }
  } catch (error: any) {
    console.error('Extraction validation failed:', error)
    return {
      success: false,
      error: 'Unable to validate extracted data',
      details: error.message
    }
  }
}

/**
 * Merge extracted data with existing profile
 * Only updates non-null fields
 */
export function mergeProfileData(
  existing: Partial<CaregiverProfile>,
  extracted: Partial<CaregiverProfile>
): Partial<CaregiverProfile> {
  const merged = { ...existing }
  
  for (const [key, value] of Object.entries(extracted)) {
    if (value !== null && value !== undefined) {
      ;(merged as any)[key] = value
    }
  }
  
  return merged
}

/**
 * Convert profile data to database format
 * Handles JSON serialization for arrays/objects
 */
export function toDBFormat(
  data: Partial<CaregiverProfile>
): Record<string, any> {
  const dbData: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      continue
    }
    
    // Serialize arrays and objects to JSON strings
    if (Array.isArray(value)) {
      dbData[key] = JSON.stringify(value)
    } else if (typeof value === 'object') {
      dbData[key] = JSON.stringify(value)
    } else {
      dbData[key] = value
    }
  }
  
  return dbData
}

/**
 * Parse database format back to typed objects
 */
export function fromDBFormat(
  dbData: any
): Partial<CaregiverProfile> {
  const data: any = {}
  
  for (const [key, value] of Object.entries(dbData)) {
    if (value === null || value === undefined) {
      continue
    }
    
    // Parse JSON strings back to arrays/objects
    if (typeof value === 'string') {
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(value)
        data[key] = parsed
      } catch {
        // Not JSON, keep as string
        data[key] = value
      }
    } else {
      data[key] = value
    }
  }
  
  return data
}

/**
 * Get list of non-null fields in profile
 */
export function getExtractedFields(
  data: Partial<CaregiverProfile>
): string[] {
  const fields: string[] = []
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      fields.push(key)
    }
  }
  
  return fields
}
