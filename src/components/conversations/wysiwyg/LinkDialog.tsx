"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { LinkDialogProps } from "./types"

export function LinkDialog({
  open,
  onOpenChange,
  linkUrl,
  linkText,
  onUrlChange,
  onTextChange,
  onInsert,
}: LinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">URL</label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => onUrlChange(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Link Text (optional)</label>
            <Input
              type="text"
              placeholder="Click here"
              value={linkText}
              onChange={(e) => onTextChange(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onInsert} disabled={!linkUrl}>
              Insert Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
