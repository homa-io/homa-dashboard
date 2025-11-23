import type { Meta, StoryObj } from '@storybook/react'
import { CustomBadge } from './custom-badge'

const meta: Meta<typeof CustomBadge> = {
  title: 'UI/Custom Badge',
  component: CustomBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'green', 'green-dot', 'green-bordered', 'green-dot-bordered',
        'red', 'red-dot', 'red-bordered', 'red-dot-bordered',
        'yellow', 'yellow-dot', 'yellow-bordered', 'yellow-dot-bordered',
        'blue', 'blue-dot', 'blue-bordered', 'blue-dot-bordered',
        'gray', 'gray-dot', 'gray-bordered', 'gray-dot-bordered',
        'purple', 'purple-dot', 'purple-bordered', 'purple-dot-bordered',
        'pink', 'pink-dot', 'pink-bordered', 'pink-dot-bordered'
      ],
    },
    showDot: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default Badge',
  },
}

export const Green: Story = {
  args: {
    variant: 'green',
    children: 'Open',
  },
}

export const Red: Story = {
  args: {
    variant: 'red',
    children: 'High Priority',
  },
}

export const RedWithDot: Story = {
  args: {
    variant: 'red-dot',
    children: 'High Priority',
  },
}

export const Yellow: Story = {
  args: {
    variant: 'yellow',
    children: 'Medium Priority',
  },
}

export const YellowWithDot: Story = {
  args: {
    variant: 'yellow-dot',
    children: 'Medium Priority',
  },
}

export const Blue: Story = {
  args: {
    variant: 'blue',
    children: 'New',
  },
}

export const Gray: Story = {
  args: {
    variant: 'gray',
    children: 'Sales Department',
  },
}

export const Purple: Story = {
  args: {
    variant: 'purple',
    children: 'Support Team',
  },
}

export const Pink: Story = {
  args: {
    variant: 'pink',
    children: 'Marketing',
  },
}

// All Colors Showcase
export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <CustomBadge variant="green">Green</CustomBadge>
      <CustomBadge variant="red">Red</CustomBadge>
      <CustomBadge variant="yellow">Yellow</CustomBadge>
      <CustomBadge variant="blue">Blue</CustomBadge>
      <CustomBadge variant="gray">Gray</CustomBadge>
      <CustomBadge variant="purple">Purple</CustomBadge>
      <CustomBadge variant="pink">Pink</CustomBadge>
    </div>
  ),
}

// All Colors with Dots
export const AllColorsWithDots: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <CustomBadge variant="green-dot">Green</CustomBadge>
      <CustomBadge variant="red-dot">Red</CustomBadge>
      <CustomBadge variant="yellow-dot">Yellow</CustomBadge>
      <CustomBadge variant="blue-dot">Blue</CustomBadge>
      <CustomBadge variant="gray-dot">Gray</CustomBadge>
      <CustomBadge variant="purple-dot">Purple</CustomBadge>
      <CustomBadge variant="pink-dot">Pink</CustomBadge>
    </div>
  ),
}

// Bordered Variants
export const BorderedVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <CustomBadge variant="green-bordered">Green Bordered</CustomBadge>
      <CustomBadge variant="red-dot-bordered">Red Dot Bordered</CustomBadge>
      <CustomBadge variant="yellow-bordered">Yellow Bordered</CustomBadge>
      <CustomBadge variant="blue-dot-bordered">Blue Dot Bordered</CustomBadge>
      <CustomBadge variant="purple-bordered">Purple Bordered</CustomBadge>
    </div>
  ),
}

// Conversation System Example
export const TicketSystemExample: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <CustomBadge variant="green">Open</CustomBadge>
      <CustomBadge variant="red-dot">High Priority</CustomBadge>
      <CustomBadge variant="gray">Sales Department</CustomBadge>
      <CustomBadge variant="blue">New</CustomBadge>
      <CustomBadge variant="yellow-dot">Medium Priority</CustomBadge>
      <CustomBadge variant="purple">Support Team</CustomBadge>
    </div>
  ),
}