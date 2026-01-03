"use client"

import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Bot,
  Globe,
  Languages,
  Book,
  Ruler,
  Power,
  PowerOff,
  UserCircle,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { AIAgent } from "@/types/ai-agent.types"
import { TONE_OPTIONS } from "@/types/ai-agent.types"

interface AIAgentListProps {
  agents: AIAgent[]
  loading: boolean
  onDelete: (agent: AIAgent) => void
  onToggleStatus: (agent: AIAgent) => void
}

export function AIAgentList({
  agents,
  loading,
  onDelete,
  onToggleStatus,
}: AIAgentListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No AI agents found</p>
        <p className="text-sm">
          Create an AI agent to automate conversation handling.
        </p>
      </div>
    )
  }

  const getToneLabel = (tone: string) => {
    const option = TONE_OPTIONS.find((opt) => opt.value === tone)
    return option?.label || tone
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Bot</TableHead>
            <TableHead className="hidden lg:table-cell">Tone</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-500" />
                    {agent.name}
                  </div>
                  {agent.instructions && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[200px]">
                      {agent.instructions}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {agent.bot ? (
                  <div className="flex items-center gap-2">
                    <Bot className="h-3 w-3 text-blue-500" />
                    <span className="text-sm">
                      {agent.bot.display_name || agent.bot.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Badge variant="outline" className="text-xs">
                  {getToneLabel(agent.tone)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 flex-wrap">
                  {agent.handover_enabled && (
                    <UserCircle
                      className="h-4 w-4 text-orange-500"
                      title="Handover to human"
                    />
                  )}
                  {agent.multi_language && (
                    <Languages
                      className="h-4 w-4 text-purple-500"
                      title="Multi-language"
                    />
                  )}
                  {agent.internet_access && (
                    <Globe
                      className="h-4 w-4 text-blue-500"
                      title="Internet access"
                    />
                  )}
                  {agent.use_knowledge_base && (
                    <Book
                      className="h-4 w-4 text-green-500"
                      title="Knowledge base"
                    />
                  )}
                  {agent.unit_conversion && (
                    <Ruler
                      className="h-4 w-4 text-gray-500"
                      title="Unit conversion"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={agent.status === "active" ? "default" : "secondary"}
                  className={
                    agent.status === "active"
                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                      : ""
                  }
                >
                  {agent.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/settings/bot/edit/${agent.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(agent)}>
                      {agent.status === "active" ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(agent)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
