'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Download, Paperclip, Send, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function TicketDetail() {
  return (
    <div className="flex-1 flex flex-col bg-card">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-semibold mb-2">Help needed for payment failure</h1>
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Open</span>
          <span className="text-xs font-medium text-red-600">High Priority</span>
          <span className="text-xs text-purple-600">Sales Department</span>
        </div>
        
        {/* Customer Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-medium text-sm">DT</span>
          </div>
          <div>
            <div className="font-medium">Dean Taylor</div>
            <div className="text-sm text-muted-foreground">23rd of June at 8 am</div>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-4">
          <p className="mb-2">Hi,</p>
          <p className="mb-4">I need help to process the payment via my VISA card.</p>
          <p className="mb-4">Its returning failed payment after the checkout. I need to send out this campaign within today. can you please help ASAP.</p>
          <p className="mb-6">Thanks</p>
        </div>

        {/* Attachments */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">2 Attachments</h4>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
              <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                <span className="text-red-600 text-xs font-bold">PDF</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">doc.pdf</div>
                <div className="text-xs text-muted-foreground">29 KB</div>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-600 text-xs font-bold">IMG</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">image.jpg</div>
                <div className="text-xs text-muted-foreground">30 KB</div>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="p-6 border-t">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs">👤</span>
          </div>
          <span className="text-sm">Reply to: <span className="text-muted-foreground">Dean Taylor (dean.taylor@gmail.com)</span></span>
          <Button variant="ghost" size="sm" className="ml-auto">
            ×
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 mb-3 p-2 border rounded">
          <select className="text-sm border-none bg-transparent">
            <option>Paragraph</option>
          </select>
          <div className="w-px h-4 bg-border mx-1"></div>
          <Button variant="ghost" size="sm">
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Underline className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1"></div>
          <Button variant="ghost" size="sm">
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <AlignRight className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1"></div>
          <Button variant="ghost" size="sm">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Link className="w-4 h-4" />
          </Button>
        </div>

        {/* Reply Input */}
        <Textarea 
          placeholder="Hi Dean,

Thank you for contacting us. We sure can help you. Shall we schedule a call tomorrow around 12:00pm. We can help you better if we are on a call.

Please let us know your availability."
          className="mb-3 min-h-[120px]"
          defaultValue="Hi Dean,

Thank you for contacting us. We sure can help you. Shall we schedule a call tomorrow around 12:00pm. We can help you better if we are on a call.

Please let us know your availability."
        />

        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4 mr-2" />
            Attach file
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}