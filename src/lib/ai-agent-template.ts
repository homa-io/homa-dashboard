/**
 * AI Agent Instruction Template Generator (Compact Version)
 * Optimized for minimal token usage while preserving all information.
 */

import type { AIAgent, AIAgentTone } from '@/types/ai-agent.types'
import type { AIAgentTool, ToolParam } from '@/types/ai-agent-tool.types'

export interface TemplateContext {
  projectName: string
  agent: AIAgent
  tools: AIAgentTool[]
  knowledgeBaseItems?: { id: number; title: string }[]
}

const TONE_SHORT: Record<AIAgentTone, string> = {
  formal: 'professional, business-appropriate',
  casual: 'friendly, conversational',
  detailed: 'comprehensive with examples',
  precise: 'concise, to-the-point',
  empathetic: 'warm, understanding',
  technical: 'technical terminology preferred',
}

function formatParams(params: ToolParam[] | null): string {
  if (!params?.length) return ''

  return params.map(p => {
    const parts = [`\`${p.key}\``]
    if (p.required) parts.push('*req*')
    if (p.value_type === 'Constant' && p.value) parts.push(`="${p.value}"`)
    else if (p.value_type === 'ByModel') parts.push('(AI fills)')
    if (p.data_type !== 'string') parts.push(`[${p.data_type}]`)
    if (p.example) parts.push(`ex:"${p.example}"`)
    return parts.join(' ')
  }).join(' | ')
}

function generateToolDocs(tools: AIAgentTool[], hasHandover: boolean): string {
  const lines: string[] = []

  if (hasHandover) {
    lines.push('`handover(reason:string)` - Transfer to human agent when: user requests, issue unresolvable, needs authorization')
    lines.push('')
  }

  tools.forEach(tool => {
    lines.push(`\`${tool.name}\` [${tool.method} ${tool.endpoint}]`)
    if (tool.description) lines.push(`  Use: ${tool.description}`)

    const qp = formatParams(tool.query_params)
    const hp = formatParams(tool.header_params)
    const bp = formatParams(tool.body_params)

    if (qp) lines.push(`  Query: ${qp}`)
    if (hp) lines.push(`  Headers: ${hp}`)
    if (bp) lines.push(`  Body(${tool.body_type}): ${bp}`)
    if (tool.authorization_type !== 'None') lines.push(`  Auth: ${tool.authorization_type}`)
    if (tool.response_instructions) lines.push(`  Response: ${tool.response_instructions}`)
    lines.push('')
  })

  return lines.join('\n')
}

export function generateAgentPrompt(context: TemplateContext): string {
  const { projectName, agent, tools, knowledgeBaseItems = [] } = context
  const botName = agent.bot?.display_name || agent.bot?.name || 'Assistant'
  const project = projectName || 'the company'

  const sections: string[] = []

  // Identity section - clear and descriptive
  const identity = [
    `# Identity`,
    `You are **${botName}**, an AI customer support assistant for **${project}**.`,
    `Your role: Help users with questions, troubleshoot issues, and provide accurate information.`,
    `Always introduce yourself as "${botName}" when greeting users.`,
  ]

  // Add greeting message if set
  if (agent.greeting_message?.trim()) {
    identity.push(``)
    identity.push(`**Greeting:** When starting a new conversation, greet with:`)
    identity.push(`"${agent.greeting_message.trim()}"`)
  }

  sections.push(identity.join('\n'))

  // Rules (compact numbered list)
  const rules: string[] = []

  // CRITICAL: Strict scope limitation - MUST BE FIRST
  rules.push('**ABSOLUTE RULE**: You can ONLY answer using information returned by your tools. No exceptions.')
  rules.push('When you have NO information from tools, respond with EXACTLY: "I don\'t have information about that." - then STOP. Say nothing else.')
  rules.push('FORBIDDEN: Do NOT say "however", "but", "you could try", "I recommend", "common solutions", "you might want to" - NEVER add suggestions')
  rules.push('FORBIDDEN: Do NOT give tips, advice, troubleshooting steps, or recommendations unless they came from a tool result')
  rules.push('If a user asks something and the tool returns nothing useful → your ONLY response is: "I don\'t have information about that."')
  if (agent.handover_enabled) {
    rules.push('If user asks for more help after you said you don\'t have info → offer handover: "Would you like me to connect you with a human agent?"')
  }

  if (agent.multi_language) {
    rules.push('Your response should match user language exactly')
  }

  rules.push(`Tone: ${TONE_SHORT[agent.tone]}`)

  // Personality traits
  const personalityParts: string[] = []
  if (agent.humor_level > 0) {
    const humorDesc = agent.humor_level <= 30 ? 'minimal humor' : agent.humor_level <= 70 ? 'moderate humor' : 'playful/witty'
    personalityParts.push(humorDesc)
  }
  if (agent.formality_level > 0) {
    const formalDesc = agent.formality_level <= 30 ? 'casual style' : agent.formality_level <= 70 ? 'balanced formality' : 'highly formal'
    personalityParts.push(formalDesc)
  }
  if (agent.use_emojis) {
    personalityParts.push('use emojis')
  }
  if (personalityParts.length > 0) {
    rules.push(`Personality: ${personalityParts.join(', ')}`)
  }

  if (agent.use_knowledge_base) {
    rules.push('Use searchKnowledgeBase tool for answers - no fabrication')
  }

  rules.push(agent.internet_access ? 'Web search available' : 'No internet - use provided context only')

  if (agent.unit_conversion) {
    rules.push('Convert units: bytes→MB/GB, seconds→mins/hrs, timestamps→readable')
  }

  if (agent.handover_enabled) {
    rules.push('Human handover available (warn: slower response)')
  }

  // "Unknown" rule removed - covered by scope limitation rules above

  // Blocked topics
  if (agent.blocked_topics?.trim()) {
    rules.push(`Refuse to discuss: ${agent.blocked_topics.trim()}`)
  }

  // Collect user info
  if (agent.collect_user_info && agent.collect_user_info_fields?.trim()) {
    const fields = agent.collect_user_info_fields.trim().split(',').map(f => f.trim()).filter(Boolean)
    rules.push(`Proactively ask user for: ${fields.join(', ')}. Once collected, call setUserInfo tool.`)
  }

  // Max response length
  if (agent.max_response_length && agent.max_response_length > 0) {
    rules.push(`Keep responses under ${agent.max_response_length} tokens (~${Math.round(agent.max_response_length * 0.75)} words)`)
  }

  // Max tool calls
  if (agent.max_tool_calls && agent.max_tool_calls > 0) {
    rules.push(`Max ${agent.max_tool_calls} tool calls per message`)
  }

  // Context window
  if (agent.context_window) {
    rules.push(`Use last ${agent.context_window} messages for context`)
  }

  sections.push('## Rules\n' + rules.map((r, i) => `${i + 1}. ${r}`).join('\n'))

  // Custom instructions (if any)
  if (agent.instructions?.trim()) {
    sections.push(`## Instructions\n${agent.instructions.trim()}`)
  }

  // Tools section
  const hasTools = tools.length > 0 || agent.handover_enabled || agent.use_knowledge_base || agent.collect_user_info || agent.priority_detection || agent.auto_tagging
  if (hasTools) {
    const toolLines: string[] = ['## Tools', 'Ask user for missing required params before calling.', '']

    // Knowledge base search tool
    if (agent.use_knowledge_base) {
      toolLines.push('`searchKnowledgeBase(query:string)` - Search the knowledge base for information.')
      toolLines.push('**CRITICAL: ALWAYS search FIRST before answering any question.**')
      toolLines.push('  - ONLY use information from search results - nothing else')
      toolLines.push('  - If no results or not relevant → say ONLY "I don\'t have information about that." and STOP')
      toolLines.push('  - Do NOT add suggestions, tips, or generic advice after saying you don\'t have info')
      toolLines.push('**Topics covered:**')
      if (knowledgeBaseItems.length > 0) {
        knowledgeBaseItems.forEach(kb => {
          toolLines.push(`  - ${kb.title}`)
        })
      } else {
        toolLines.push('  - Product information, FAQs, documentation, policies, guides')
      }
      toolLines.push('')
    }

    // Collect user info tool
    if (agent.collect_user_info && agent.collect_user_info_fields?.trim()) {
      const fields = agent.collect_user_info_fields.trim().split(',').map(f => f.trim()).filter(Boolean)
      toolLines.push('`setUserInfo(data:object)` - Save collected user information.')
      toolLines.push(`  Fields to collect: ${fields.join(', ')}`)
      toolLines.push('  Call with JSON object containing collected fields, e.g.: {"name": "John", "email": "john@example.com"}')
      toolLines.push('  Ask naturally during conversation, don\'t demand all at once')
      toolLines.push('')
    }

    // Priority detection tool
    if (agent.priority_detection) {
      toolLines.push('`setPriority(priority:string)` - Set conversation priority based on urgency.')
      toolLines.push('  Options: "low", "medium", "high", "urgent"')
      toolLines.push('  Use when: user expresses urgency, mentions deadlines, or has critical issues')
      toolLines.push('')
    }

    // Auto tagging tool
    if (agent.auto_tagging) {
      toolLines.push('`setTag(tag:string)` - Tag the conversation based on topic.')
      toolLines.push('  Automatically detect and apply relevant tags from conversation context')
      toolLines.push('  Use early in conversation when topic becomes clear')
      toolLines.push('')
    }

    // Add handover and custom tools
    toolLines.push(generateToolDocs(tools, agent.handover_enabled && !!agent.handover_user_id))

    sections.push(toolLines.join('\n'))
  }

  // Context usage (minimal)
  sections.push('## Context\nUse conversation history: maintain context, don\'t re-ask known info, track multi-step issues.')

  return sections.join('\n\n')
}

export function generateAgentPromptPreview(context: TemplateContext): string {
  return generateAgentPrompt(context)
}

export function estimateTokenCount(text: string): number {
  // ~4 chars per token for English
  return Math.ceil(text.length / 4)
}
