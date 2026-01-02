"use client"

import * as React from "react"
import { useState, useCallback, useMemo } from "react"
import { Check, Plus, Tag, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TagPickerProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  className?: string
  suggestions?: string[]
  allowCreate?: boolean
}

// Generate a consistent color for a tag based on its name
function getTagColor(tagName: string): string {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  ]

  // Simple hash function to get consistent color
  let hash = 0
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function TagPicker({
  tags,
  onTagsChange,
  placeholder = "Add tags...",
  className,
  suggestions = [],
  allowCreate = true,
}: TagPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  // Filter suggestions based on search and exclude already selected tags
  const filteredSuggestions = useMemo(() => {
    const lowerSearch = searchValue.toLowerCase().trim()
    return suggestions.filter(
      (suggestion) =>
        !tags.includes(suggestion) &&
        (lowerSearch === "" || suggestion.toLowerCase().includes(lowerSearch))
    )
  }, [suggestions, tags, searchValue])

  // Check if the search value matches any existing suggestion (case-insensitive)
  const exactMatch = useMemo(() => {
    const lowerSearch = searchValue.toLowerCase().trim()
    return suggestions.some((s) => s.toLowerCase() === lowerSearch)
  }, [suggestions, searchValue])

  // Check if the tag is already selected
  const alreadySelected = useMemo(() => {
    const lowerSearch = searchValue.toLowerCase().trim()
    return tags.some((t) => t.toLowerCase() === lowerSearch)
  }, [tags, searchValue])

  const canCreateNew = allowCreate &&
    searchValue.trim() !== "" &&
    !exactMatch &&
    !alreadySelected

  const handleAddTag = useCallback((tag: string) => {
    if (!tags.includes(tag)) {
      onTagsChange([...tags, tag])
    }
    setSearchValue("")
  }, [tags, onTagsChange])

  const handleRemoveTag = useCallback((tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag))
  }, [tags, onTagsChange])

  const handleCreateTag = useCallback(() => {
    const newTag = searchValue.trim()
    if (newTag && !tags.includes(newTag)) {
      onTagsChange([...tags, newTag])
      setSearchValue("")
    }
  }, [searchValue, tags, onTagsChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (canCreateNew) {
        handleCreateTag()
      } else if (filteredSuggestions.length > 0) {
        handleAddTag(filteredSuggestions[0])
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }, [canCreateNew, handleCreateTag, filteredSuggestions, handleAddTag])

  return (
    <div className={cn("space-y-2", className)}>
      {/* Selected Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                "gap-1 pr-1 text-xs h-6 flex-shrink-0 border",
                getTagColor(tag)
              )}
            >
              <Tag className="w-3 h-3" />
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Picker Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full justify-start text-muted-foreground font-normal text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded-md">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search or create tag..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>

          {/* Tag List */}
          <div className="max-h-[240px] overflow-y-auto p-1">
            {/* Create New Tag Option */}
            {canCreateNew && (
              <button
                type="button"
                onClick={handleCreateTag}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm text-left rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span>Create</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-1 text-xs h-5 border",
                    getTagColor(searchValue.trim())
                  )}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {searchValue.trim()}
                </Badge>
              </button>
            )}

            {/* Existing Tags */}
            {filteredSuggestions.length > 0 ? (
              <div className="space-y-0.5">
                {canCreateNew && <div className="h-px bg-border my-1" />}
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleAddTag(suggestion)}
                    className="w-full flex items-center gap-2 px-2 py-2 text-sm text-left rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs h-5 border",
                        getTagColor(suggestion)
                      )}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {suggestion}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : (
              !canCreateNew && (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  {searchValue.trim()
                    ? alreadySelected
                      ? "Tag already selected"
                      : "No matching tags"
                    : "No available tags"
                  }
                </div>
              )
            )}
          </div>

          {/* Footer */}
          {(filteredSuggestions.length > 0 || canCreateNew) && (
            <div className="p-2 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Enter</kbd> to {canCreateNew ? "create" : "select"}
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
