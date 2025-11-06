export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string; details?: any }

export interface ConversationStats {
  messageCount: number
  fieldsExtracted: string[]
  fieldsCovered: number
  totalFields: number
  completionPercentage: number
  duration: number // milliseconds
  averageResponseTime: number
}
