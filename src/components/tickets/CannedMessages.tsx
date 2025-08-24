"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { MessageSquare, Search } from "lucide-react"

interface CannedMessage {
  id: string
  title: string
  message: string
  category: string
}

interface CannedMessagesProps {
  onMessageSelect: (message: string) => void
}

export function CannedMessages({ onMessageSelect }: CannedMessagesProps) {
  const [isOpen, setIsOpen] = useState(false)

  const cannedMessages: CannedMessage[] = [
    {
      id: "1",
      title: "Thank you for contacting us",
      message: "Hi!\n\nThank you for contacting us. We have received your message and will get back to you shortly.\n\nBest regards,\nSupport Team",
      category: "Greeting"
    },
    {
      id: "2", 
      title: "Payment issue resolution",
      message: "Hi!\n\nThank you for contacting us regarding the payment issue. We can help you resolve this.\n\nCould you please provide:\n- The last 4 digits of your card\n- The approximate transaction date\n- Any error messages you received\n\nWe'll investigate this immediately.\n\nBest regards,\nBilling Team",
      category: "Billing"
    },
    {
      id: "3",
      title: "Schedule a call",
      message: "Hi!\n\nThank you for reaching out. To better assist you, we'd like to schedule a call.\n\nPlease let us know your availability for this week, and we'll set up a convenient time.\n\nLooking forward to helping you!\n\nBest regards,\nSupport Team",
      category: "Support"
    },
    {
      id: "4",
      title: "Account verification needed",
      message: "Hi!\n\nFor security purposes, we need to verify your account before proceeding.\n\nPlease provide:\n- Your registered email address\n- Account creation date (approximate)\n- Last transaction reference (if any)\n\nOnce verified, we'll resolve your issue immediately.\n\nBest regards,\nSecurity Team",
      category: "Security"
    },
    {
      id: "5",
      title: "Issue resolved - follow up",
      message: "Hi!\n\nWe're happy to inform you that your issue has been resolved.\n\nIf you experience any further problems or have questions, please don't hesitate to reach out.\n\nThank you for your patience!\n\nBest regards,\nSupport Team",
      category: "Resolution"
    },
    {
      id: "6",
      title: "Technical support escalation",
      message: "Hi!\n\nThank you for providing the details. Your issue has been escalated to our technical team.\n\nExpected resolution time: 24-48 hours\nTicket reference: [TICKET_ID]\n\nWe'll keep you updated on the progress.\n\nBest regards,\nTechnical Support",
      category: "Technical"
    }
  ]

  const categories = Array.from(new Set(cannedMessages.map(msg => msg.category)))

  const handleMessageSelect = (message: CannedMessage) => {
    onMessageSelect(message.message)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <MessageSquare className="w-4 h-4 mr-2" />
          Canned Messages
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Select Canned Message
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Command className="border">
            <CommandInput placeholder="Search messages..." />
            <CommandList className="max-h-[400px]">
              <CommandEmpty>No messages found.</CommandEmpty>
              {categories.map((category) => (
                <CommandGroup key={category} heading={category}>
                  {cannedMessages
                    .filter(msg => msg.category === category)
                    .map((message) => (
                      <CommandItem
                        key={message.id}
                        onSelect={() => handleMessageSelect(message)}
                        className="cursor-pointer p-3"
                      >
                        <div className="w-full">
                          <div className="font-medium text-sm mb-1">{message.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {message.message.replace(/\n/g, ' ').substring(0, 100)}...
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )
}