"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Star, Video, Image as ImageIcon, GripVertical } from "lucide-react"
import { getMediaUrl } from "@/services/api-client"

interface MediaItem {
  id?: string
  type: "image" | "video"
  url: string
  title: string
  description?: string
  sort_order: number
  is_primary?: boolean
  isNew?: boolean
  file?: File
}

interface SortableMediaItemProps {
  item: MediaItem
  index: number
  onRemove: (index: number) => void
  onTogglePrimary: (index: number) => void
  onPreview?: (item: MediaItem) => void
  size?: "small" | "large"
}

export function SortableMediaItem({ item, index, onRemove, onTogglePrimary, onPreview, size = "small" }: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id || `new-${index}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger preview if not clicking on action buttons
    if (onPreview && !(e.target as HTMLElement).closest('button')) {
      onPreview(item)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={`relative group bg-muted rounded-lg overflow-hidden cursor-pointer ${
        size === "large" ? "aspect-[4/3]" : "aspect-video"
      } ${item.is_primary ? "ring-2 ring-yellow-500" : ""} ${isDragging ? "z-50 shadow-lg" : ""}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 z-10 cursor-grab active:cursor-grabbing p-1 rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-white" />
      </div>

      {/* Media Content */}
      {item.type === "image" ? (
        <img
          src={getMediaUrl(item.url)}
          alt={item.title}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      ) : (
        <video
          src={getMediaUrl(item.url)}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      )}

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button
          variant={item.is_primary ? "default" : "secondary"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onTogglePrimary(index)
          }}
          title={item.is_primary ? "Remove as primary" : "Set as primary"}
        >
          <Star className={`w-4 h-4 ${item.is_primary ? "fill-yellow-400 text-yellow-400" : ""}`} />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(index)
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Primary Indicator */}
      {item.is_primary && (
        <div className="absolute top-1 right-1">
          <Badge className="bg-yellow-500 text-white text-xs">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Primary
          </Badge>
        </div>
      )}

      {/* Type Badge */}
      <div className="absolute bottom-1 left-1">
        {item.type === "video" ? (
          <Badge variant="secondary" className="text-xs">
            <Video className="w-3 h-3 mr-1" />
            Video
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">
            <ImageIcon className="w-3 h-3 mr-1" />
            Image
          </Badge>
        )}
      </div>

      {/* Sort Order Badge */}
      <div className="absolute bottom-1 right-1">
        <Badge variant="outline" className="text-xs bg-white/80">
          #{index + 1}
        </Badge>
      </div>
    </div>
  )
}
