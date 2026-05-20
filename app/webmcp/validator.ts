import type { ValidationRule } from './types'

type CodeType = 'html' | 'js' | 'unknown'

function detectCodeType(code: string): CodeType {
  const trimmed = code.trim()
  if (trimmed.startsWith('<') || /<form[\s>]/i.test(trimmed) || /<input[\s>]/i.test(trimmed)) {
    return 'html'
  }
  if (
    trimmed.includes('navigator.modelContext') ||
    trimmed.includes('registerTool') ||
    trimmed.includes('inputSchema')
  ) {
    return 'js'
  }
  return 'unknown'
}

function validateHTML(code: string): ValidationRule[] {
  const rules: ValidationRule[] = []

  const hasForm = /<form[\s>]/i.test(code)
  rules.push({
    id: 'html-form',
    label: '<form> element',
    status: hasForm ? 'pass' : 'fail',
    message: hasForm ? 'Form element found' : 'Missing <form> element',
  })

  const hasToolName = /toolname\s*=/i.test(code)
  rules.push({
    id: 'html-toolname',
    label: 'toolname attribute',
    status: hasToolName ? 'pass' : 'fail',
    message: hasToolName
      ? 'toolname attribute present'
      : 'Missing required toolname attribute on <form>',
  })

  const hasToolDesc = /tooldescription\s*=/i.test(code)
  rules.push({
    id: 'html-tooldesc',
    label: 'tooldescription attribute',
    status: hasToolDesc ? 'pass' : 'fail',
    message: hasToolDesc
      ? 'tooldescription attribute present'
      : 'Missing required tooldescription attribute',
  })

  const hasParamTitle = /toolparamtitle\s*=/i.test(code)
  rules.push({
    id: 'html-paramtitle',
    label: 'toolparamtitle on inputs',
    status: hasParamTitle ? 'pass' : 'warn',
    message: hasParamTitle
      ? 'toolparamtitle found on inputs'
      : 'No toolparamtitle on inputs; agents may not understand param names',
  })

  const hasParamDesc = /toolparamdescription\s*=/i.test(code)
  rules.push({
    id: 'html-paramdesc',
    label: 'toolparamdescription on inputs',
    status: hasParamDesc ? 'pass' : 'warn',
    message: hasParamDesc
      ? 'toolparamdescription found'
      : 'No toolparamdescription; consider adding for better agent comprehension',
  })

  const hasAutoSubmit = /toolautosubmit/i.test(code)
  rules.push({
    id: 'html-autosubmit',
    label: 'toolautosubmit attribute',
    status: hasAutoSubmit ? 'pass' : 'warn',
    message: hasAutoSubmit
      ? 'Auto-submit enabled'
      : 'No toolautosubmit; agents will prompt user before submitting',
  })

  return rules
}

function validateJS(code: string): ValidationRule[] {
  const rules: ValidationRule[] = []

  const hasRegister = /registerTool/i.test(code)
  rules.push({
    id: 'js-register',
    label: 'registerTool() call',
    status: hasRegister ? 'pass' : 'fail',
    message: hasRegister
      ? 'registerTool call found'
      : 'Missing navigator.modelContext.registerTool()',
  })

  const hasName = /name\s*:/.test(code)
  rules.push({
    id: 'js-name',
    label: 'name property',
    status: hasName ? 'pass' : 'fail',
    message: hasName ? 'name property present' : 'Missing required name property',
  })

  const hasDescription = /description\s*:/.test(code)
  rules.push({
    id: 'js-desc',
    label: 'description property',
    status: hasDescription ? 'pass' : 'fail',
    message: hasDescription ? 'description property present' : 'Missing required description',
  })

  const hasInputSchema = /inputSchema\s*:/.test(code)
  rules.push({
    id: 'js-schema',
    label: 'inputSchema property',
    status: hasInputSchema ? 'pass' : 'fail',
    message: hasInputSchema
      ? 'inputSchema defined'
      : 'Missing inputSchema; agents need this to pass parameters',
  })

  const hasExecute = /execute\s*[(:]/.test(code)
  rules.push({
    id: 'js-execute',
    label: 'execute function',
    status: hasExecute ? 'pass' : 'fail',
    message: hasExecute ? 'execute handler found' : 'Missing execute function',
  })

  const hasAnnotations = /annotations\s*:/.test(code)
  rules.push({
    id: 'js-annotations',
    label: 'annotations object',
    status: hasAnnotations ? 'pass' : 'warn',
    message: hasAnnotations
      ? 'annotations present'
      : 'No annotations; consider adding title and hint flags',
  })

  return rules
}

export function validate(code: string): { type: CodeType; rules: ValidationRule[] } {
  const type = detectCodeType(code)
  if (type === 'html') return { type, rules: validateHTML(code) }
  if (type === 'js') return { type, rules: validateJS(code) }
  return {
    type,
    rules: [
      {
        id: 'detect-fail',
        label: 'Code detection',
        status: 'fail',
        message:
          'Could not detect WebMCP code. Paste a <form> with toolname or a registerTool() call.',
      },
    ],
  }
}
