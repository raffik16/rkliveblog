import type { ToolDefinition } from './types'

export function generateDeclarativeHTML(tool: ToolDefinition): string {
  const paramInputs = tool.params
    .map((p) => {
      const reqAttr = p.required ? ' required' : ''
      return `  <input\n    type="${p.type === 'number' ? 'number' : 'text'}"\n    name="${p.name}"\n    toolparamtitle="${p.name}"\n    toolparamdescription="${p.description}"${reqAttr}\n  />`
    })
    .join('\n')

  return `<form
  toolname="${tool.name}"
  tooldescription="${tool.description}"${tool.autoSubmit ? '\n  toolautosubmit' : ''}
>
${paramInputs}
  <button type="submit">Run</button>
</form>`
}

export function generateImperativeJS(tool: ToolDefinition): string {
  const schemaProps = tool.params.reduce(
    (acc, p) => {
      acc[p.name] = { type: p.type === 'number' ? 'number' : 'string', description: p.description }
      return acc
    },
    {} as Record<string, { type: string; description: string }>
  )

  const required = tool.params.filter((p) => p.required).map((p) => p.name)

  const schema = JSON.stringify(
    {
      type: 'object',
      properties: schemaProps,
      required,
    },
    null,
    2
  )

  return `navigator.modelContext.registerTool({
  name: "${tool.name}",
  description: "${tool.description}",
  inputSchema: ${schema},
  annotations: {
    title: "${tool.name}",
    readOnlyHint: false,
    openWorldHint: false
  },
  async execute(params) {
    // Your implementation here
    const result = await fetch("/api/${tool.name}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    return await result.json();
  }
});`
}
