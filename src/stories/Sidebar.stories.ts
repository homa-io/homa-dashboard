import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AppSidebar } from '@/components/app-sidebar'

const meta: Meta<typeof AppSidebar> = {
  title: 'Layout/Sidebar',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="h-screen">
      <AppSidebar />
    </div>
  ),
}

export const Collapsed: Story = {
  render: () => (
    <div className="h-screen">
      <AppSidebar collapsible="icon" />
    </div>
  ),
}