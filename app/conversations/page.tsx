import { Suspense } from 'react'
import ConversationsContent from './ConversationsContent'

export default function ConversationsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading conversations...</div>}>
      <ConversationsContent />
    </Suspense>
  )
}
