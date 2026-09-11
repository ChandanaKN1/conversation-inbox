import type { Conversation } from "../types/conversation"

type Props = {
  conversation: Conversation
  onResolve: (id: string) => void
  hasFailed: boolean
}

export default function ConversationItem({ conversation, onResolve, hasFailed }: Props) {
  return (
    <div style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
      <h3>{conversation.customerName}</h3>
      <p>{conversation.message}</p>
      <p>Priority: {conversation.priority}</p>
      <p>Status: {conversation.status}</p>

      <button
        disabled={conversation.status === "resolved"}
        onClick={() => onResolve(conversation.id)}
      >
        Resolve
      </button>

      {hasFailed && <p>Couldn't resolve. Try again.</p>}
    </div>
  )
}
