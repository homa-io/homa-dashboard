"use client"

import * as React from "react"
import { ReactTags, type Tag } from 'react-tag-autocomplete'
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  className?: string
  suggestions?: string[]
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = "Add tags...",
  className,
  suggestions = []
}: TagInputProps) {
  // Convert string tags to Tag objects
  const selected: Tag[] = tags.map((tag, index) => ({
    value: index,
    label: tag
  }))

  // Convert suggestion strings to Tag objects, filtering out already selected tags
  const tagSuggestions: Tag[] = suggestions
    .filter(suggestion => !tags.includes(suggestion))
    .map((suggestion, index) => ({
      value: `suggestion-${index}`,
      label: suggestion
    }))

  const onAdd = (newTag: Tag) => {
    onTagsChange([...tags, newTag.label])
  }

  const onDelete = (tagIndex: number) => {
    onTagsChange(tags.filter((_, i) => i !== tagIndex))
  }

  return (
    <div className={cn("relative", className)}>
      <ReactTags
        selected={selected}
        suggestions={tagSuggestions}
        onAdd={onAdd}
        onDelete={onDelete}
        placeholderText={placeholder}
        noOptionsText="No matching tags"
        allowNew={true}
        collapseOnSelect={true}
        classNames={{
          root: 'react-tags border border-input rounded-md bg-background min-h-[36px] p-1.5',
          rootIsActive: 'ring-2 ring-ring ring-offset-2',
          rootIsDisabled: 'opacity-50 cursor-not-allowed',
          rootIsInvalid: 'border-destructive',
          label: 'sr-only',
          tagList: 'flex flex-wrap gap-1 mb-1',
          tagListItem: 'inline-block',
          tag: 'inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs',
          tagName: 'text-secondary-foreground',
          comboBox: 'relative inline-block w-full',
          input: 'border-0 outline-none bg-transparent text-xs placeholder:text-muted-foreground min-w-[80px] p-0 h-6',
          listBox: 'absolute z-50 mt-2 max-h-80 min-w-[300px] overflow-auto rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-gray-100 shadow-lg',
          option: 'relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground transition-colors',
          optionIsActive: 'bg-accent text-accent-foreground',
          highlight: 'font-semibold'
        }}
        renderTag={({ classNames, tag, ...tagProps }) => (
          <Badge key={tag.value} variant="secondary" className="gap-1 pr-1 text-xs h-6 flex-shrink-0">
            {tag.label}
            <button
              type="button"
              {...tagProps}
              className="ml-1 hover:bg-muted rounded-sm p-0.5"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        )}
      />
    </div>
  )
}
