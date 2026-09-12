import { CheckCircle2 } from "../icons"
import type { Conversation } from "../types/conversation"
import ConversationItem from "./ConversationItem"

type Props = {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function ConversationList({ conversations, selectedId, onSelect }: Props) {
  if (conversations.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400 p-6 text-center">
        <CheckCircle2 className="w-8 h-8 text-green-400" />
        <p className="font-medium text-gray-600">You're all caught up</p>
        <p className="text-sm">No conversations need your attention right now.</p>
      </div>
    )
  }

  return (
    <div>
      {conversations.map((c) => (
        <ConversationItem
          key={c.id}
          conversation={c}
          isSelected={c.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
