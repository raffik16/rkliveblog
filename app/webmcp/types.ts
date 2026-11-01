export interface ToolParam {
  name: string
  type: string
  description: string
  required: boolean
}

/**
 * The ToolAnnotations hints the generator can set. The spec's dictionary also has `debugging`;
 * MCP-only hints (openWorldHint, destructiveHint, idempotentHint) are dropped by WebIDL.
 * Every hint defaults to false.
 */
export type ToolAnnotationKey = 'readOnlyHint' | 'consequentialHint' | 'untrustedContentHint'

export type ToolAnnotationFlags = Partial<Record<ToolAnnotationKey, boolean>>

export interface ToolDefinition {
  name: string
  /** Optional human-readable label for browser UI (top-level `title`, `tooltitle` on forms). */
  title?: string
  description: string
  params: ToolParam[]
  autoSubmit: boolean
  /** Imperative API only. Missing keys mean false. */
  annotations?: ToolAnnotationFlags
}

export interface ValidationRule {
  id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  message: string
}
