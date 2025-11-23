import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import TicketsPage from '@/app/conversations/page'

const meta: Meta<typeof TicketsPage> = {
  title: 'Pages/TicketsPage',
  component: TicketsPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <TicketsPage />,
}