import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from '@/components/ui/badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Open',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'New',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'High Priority',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Sales Department',
    variant: 'outline',
  },
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Open</Badge>
      <Badge variant="secondary">New</Badge>
      <Badge variant="destructive">High Priority</Badge>
      <Badge variant="outline">Sales Department</Badge>
    </div>
  ),
}