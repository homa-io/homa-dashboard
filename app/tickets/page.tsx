import { Suspense } from 'react'
import TicketsContent from './TicketsContent'

export default function TicketsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading tickets...</div>}>
      <TicketsContent />
    </Suspense>
  )
}
