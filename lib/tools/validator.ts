import type { Result, ValidationRule } from './types'

/**
 * Validate a single profile field
 */
export function validateField(
  fieldName: string,
  value: any
): Result<any> {
  const rule = getFieldValidation(fieldName)
  
  if (!rule) {
    // No validation rule, accept value
    return { success: true, data: value }
  }
  
  // Type validation
  const actualType = Array.isArray(value) ? 'array' 
    : typeof value === 'object' && value !== null ? 'object'
    : typeof value
  
  if (actualType !== rule.type) {
    return {
      success: false,
      error: rule.errorMessage || `${fieldName} must be a ${rule.type}`
    }
  }
  
  // Custom validator
  if (rule.validator && !rule.validator(value)) {
    return {
      success: false,
      error: rule.errorMessage || `${fieldName} is invalid`
    }
  }
  
  // Pattern validation
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return {
      success: false,
      error: rule.errorMessage || `${fieldName} format is invalid`
    }
  }
  
  // Min/max validation for arrays
  if (rule.type === 'array' && Array.isArray(value)) {
    if (rule.min !== undefined && value.length < rule.min) {
      return {
        success: false,
        error: `${fieldName} must have at least ${rule.min} items`
      }
    }
    if (rule.max !== undefined && value.length > rule.max) {
      return {
        success: false,
        error: `${fieldName} must have at most ${rule.max} items`
      }
    }
  }
  
  return { success: true, data: value }
}

/**
 * Validate location format
 */
export function validateLocation(location: string): Result<string> {
  if (!location || location.trim().length < 2) {
    return {
      success: false,
      error: 'Location must be at least 2 characters'
    }
  }
  
  return { success: true, data: location.trim() }
}

/**
 * Validate hourly rate format and range
 */
export function validateHourlyRate(rate: string): Result<string> {
  // Accept formats like: $30, $30/hour, $30/hr, 30, etc.
  const cleaned = rate.replace(/[^0-9.]/g, '')
  const numericRate = parseFloat(cleaned)
  
  if (isNaN(numericRate) || numericRate <= 0) {
    return {
      success: false,
      error: 'Hourly rate must be a positive number'
    }
  }
  
  if (numericRate < 10 || numericRate > 200) {
    return {
      success: false,
      error: 'Hourly rate must be between $10 and $200'
    }
  }
  
  // Normalize format
  return { success: true, data: `$${numericRate}/hour` }
}

/**
 * Validate language codes
 */
export function validateLanguages(languages: string[]): Result<string[]> {
  if (!Array.isArray(languages) || languages.length === 0) {
    return {
      success: false,
      error: 'At least one language is required'
    }
  }
  
  const validLanguages = languages.filter(lang => 
    lang && typeof lang === 'string' && lang.trim().length > 0
  )
  
  if (validLanguages.length === 0) {
    return {
      success: false,
      error: 'At least one valid language is required'
    }
  }
  
  return { success: true, data: validLanguages }
}

/**
 * Get validation rules for a field
 */
export function getFieldValidation(
  fieldName: string
): ValidationRule | null {
  const rules: Record<string, ValidationRule> = {
    location: {
      type: 'string',
      validator: (val: string) => val.length >= 2,
      errorMessage: 'Location must be at least 2 characters'
    },
    languages: {
      type: 'array',
      min: 1,
      errorMessage: 'At least one language is required'
    },
    careTypes: {
      type: 'array',
      min: 1,
      errorMessage: 'At least one care type is required'
    },
    hourlyRate: {
      type: 'string',
      pattern: /\$?\d+(\.\d{2})?(\/hour|\/hr)?/,
      errorMessage: 'Hourly rate must be in format like "$30/hour"'
    },
    qualifications: {
      type: 'array'
    },
    startDate: {
      type: 'string'
    },
    generalAvailability: {
      type: 'string'
    },
    yearsOfExperience: {
      type: 'object'
    },
    weeklyHours: {
      type: 'string'
    },
    preferredAgeGroups: {
      type: 'array'
    },
    responsibilities: {
      type: 'array'
    },
    commuteDistance: {
      type: 'string'
    },
    commuteType: {
      type: 'string'
    },
    willDriveChildren: {
      type: 'string'
    },
    accessibilityNeeds: {
      type: 'string'
    },
    dietaryPreferences: {
      type: 'array'
    },
    additionalChildRate: {
      type: 'string'
    },
    payrollRequired: {
      type: 'string'
    },
    benefitsRequired: {
      type: 'array'
    },
    profilePictureUrl: {
      type: 'string',
      pattern: /^https?:\/\/.+/,
      errorMessage: 'Profile picture URL must be a valid HTTP(S) URL'
    }
  }
  
  return rules[fieldName] || null
}
