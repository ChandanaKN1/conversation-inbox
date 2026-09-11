import type { Conversation } from "../types/conversation"
import ConversationItem from "./ConversationItem"

type Props = {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function ConversationList({ conversations, selectedId, onSelect }: Props) {
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
