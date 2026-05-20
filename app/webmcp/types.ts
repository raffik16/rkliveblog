export interface ToolParam {
  name: string
  type: string
  description: string
  required: boolean
}

export interface ToolDefinition {
  name: string
  description: string
  params: ToolParam[]
  autoSubmit: boolean
}

export interface ValidationRule {
  id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  message: string
}
