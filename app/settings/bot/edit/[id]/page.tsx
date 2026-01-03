"use client"

import { use } from "react"
import { AIAgentEditPage } from "@/components/settings/bot/ai-agents/AIAgentEditPage"

interface AIAgentEditProps {
  params: Promise<{ id: string }>
}

export default function AIAgentEdit({ params }: AIAgentEditProps) {
  const { id } = use(params)
  return <AIAgentEditPage agentId={parseInt(id, 10)} />
}
