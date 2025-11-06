import type { CaregiverProfile } from '../schema'

export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string; details?: any }

export interface ExtractionResult {
  data: Partial<CaregiverProfile>
  fields: string[]
}

export interface ValidationRule {
  type: 'string' | 'number' | 'array' | 'object'
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => boolean
  errorMessage?: string
}
