import type { Conversation } from "../types/conversation"
import ConversationItem from "./ConversationItem"

type Props = {
  conversations: Conversation[]
  onResolve: (id: string) => void
}

export default function ConversationList({ conversations, onResolve }: Props) {
  return (
    <div>
      {conversations.map((c) => (
        <ConversationItem key={c.id} conversation={c} onResolve={onResolve} />
      ))}
    </div>
  )
}
