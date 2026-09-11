import type { Conversation } from "../types/conversation"
import ConversationItem from "./ConversationItem"

type Props = {
  conversations: Conversation[]
  onResolve: (id: string) => void
  failedId: string | null
}

export default function ConversationList({ conversations, onResolve, failedId }: Props) {
  return (
    <div>
      {conversations.map((c) => (
        <ConversationItem
          key={c.id}
          conversation={c}
          onResolve={onResolve}
          hasFailed={c.id === failedId}
        />
      ))}
    </div>
  )
}
