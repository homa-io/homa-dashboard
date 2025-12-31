"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GripVertical, Bot, User, X } from "lucide-react"
import type { DepartmentUser } from "@/types/department.types"

interface SortableUserItemProps {
  user: DepartmentUser
  index: number
  onRemove: (userId: string) => void
  disabled?: boolean
}

export function SortableUserItem({ user, index, onRemove, disabled }: SortableUserItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: user.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border bg-background transition-colors ${
        isDragging ? "opacity-50 border-primary shadow-lg" : "hover:bg-muted/50"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className={`flex items-center justify-center h-8 w-8 rounded cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground hover:bg-muted ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
        {index + 1}
      </div>

      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        {user.type === 'bot' ? (
          <Bot className="h-4 w-4 text-blue-500" />
        ) : (
          <User className="h-4 w-4 text-gray-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {user.display_name || `${user.name} ${user.last_name}`}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {user.email}
        </p>
      </div>

      <Badge variant="outline" className="text-xs flex-shrink-0">
        {user.type}
      </Badge>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(user.id)}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
