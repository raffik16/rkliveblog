'use client'

import React from 'react'

interface Token {
  type: 'tag' | 'attr' | 'string' | 'keyword' | 'comment' | 'punctuation' | 'text' | 'number'
  value: string
}

function tokenizeHTML(code: string): Token[] {
  const tokens: Token[] = []
  const re =
    /(<!--[\s\S]*?-->)|(<\/?[\w-]+)|(\s+[\w-]+)(?==)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(>|\/>)|([^<]+)/g
  let match: RegExpExecArray | null

  while ((match = re.exec(code)) !== null) {
    if (match[1]) tokens.push({ type: 'comment', value: match[1] })
    else if (match[2]) tokens.push({ type: 'tag', value: match[2] })
    else if (match[3]) tokens.push({ type: 'attr', value: match[3] })
    else if (match[4]) tokens.push({ type: 'string', value: match[4] })
    else if (match[5]) tokens.push({ type: 'punctuation', value: match[5] })
    else if (match[6]) tokens.push({ type: 'text', value: match[6] })
  }
  return tokens
}

function tokenizeJS(code: string): Token[] {
  const tokens: Token[] = []
  const keywords = new Set([
    'const', 'let', 'var', 'function', 'return', 'async', 'await',
    'if', 'else', 'for', 'while', 'import', 'export', 'from',
    'true', 'false', 'null', 'undefined', 'new', 'typeof', 'class',
  ])

  const re =
    /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\.?\d*\b)|(\b[a-zA-Z_$][\w$]*\b)|([{}()\[\];:.,=>+\-*\/!?&|])|(\s+)/gm
  let match: RegExpExecArray | null

  while ((match = re.exec(code)) !== null) {
    if (match[1]) tokens.push({ type: 'comment', value: match[1] })
    else if (match[2]) tokens.push({ type: 'string', value: match[2] })
    else if (match[3]) tokens.push({ type: 'number', value: match[3] })
    else if (match[4])
      tokens.push({
        type: keywords.has(match[4]) ? 'keyword' : 'text',
        value: match[4],
      })
    else if (match[5]) tokens.push({ type: 'punctuation', value: match[5] })
    else if (match[6]) tokens.push({ type: 'text', value: match[6] })
  }
  return tokens
}

const colorMap: Record<Token['type'], string> = {
  tag: 'text-orange-400',
  attr: 'text-sky-400',
  string: 'text-emerald-400',
  keyword: 'text-violet-400',
  comment: 'text-gray-500 italic',
  punctuation: 'text-gray-400',
  text: 'text-gray-200',
  number: 'text-amber-300',
}

export function CodeBlock({
  code,
  language,
}: {
  code: string
  language: 'html' | 'js'
}) {
  const tokens = language === 'html' ? tokenizeHTML(code) : tokenizeJS(code)

  return (
    <pre className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm leading-relaxed">
      <code>
        {tokens.map((token, i) => (
          <span key={i} className={colorMap[token.type]}>
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  )
}
