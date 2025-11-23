import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TicketCard } from '@/components/conversations/TicketCard'

const meta: Meta<typeof TicketCard> = {
  title: 'Conversations/TicketCard',
  component: TicketCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleTicket = {
  id: 1,
  author: 'Dean Taylor',
  avatar: '/avatars/dean.jpg',
  initials: 'DT',
  title: 'Help needed for payment failure',
  preview: 'Hi, I need help to process the payment via my VISA card.',
  time: '2 mins ago',
  status: 'Open' as const,
  priority: 'High Priority' as const,
  department: 'Sales Department' as const,
  date: '23rd of June at 8 am',
  message: 'Hi,\\n\\nI need help to process the payment via my VISA card.\\n\\nThanks',
}

export const Default: Story = {
  args: {
    conversation: sampleTicket,
    selected: false,
    onClick: () => {},
  },
}

export const Selected: Story = {
  args: {
    conversation: sampleTicket,
    selected: true,
    onClick: () => {},
  },
}

export const NewTicket: Story = {
  args: {
    conversation: {
      ...sampleTicket,
      id: 2,
      author: 'Jenny Wilson',
      initials: 'JW',
      status: 'New' as const,
      priority: 'Medium Priority' as const,
      department: 'Marketing Department' as const,
    },
    selected: false,
    onClick: () => {},
  },
}