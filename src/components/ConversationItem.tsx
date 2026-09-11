import type { Conversation } from "../types/conversation"

type Props = {
  conversation: Conversation
  isSelected: boolean
  onSelect: (id: string) => void
}

const priorityStyles: Record<Conversation["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700"
}

export default function ConversationItem({ conversation, isSelected, onSelect }: Props) {
  const isResolved = conversation.status === "resolved"

  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={`cursor-pointer border-b border-gray-200 px-4 py-3 hover:bg-gray-50 ${
        isSelected ? "bg-blue-50" : ""
      } ${isResolved ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium text-gray-900 truncate">{conversation.customerName}</h3>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyles[conversation.priority]}`}
        >
          {conversation.priority}
        </span>
      </div>
      <p className="text-sm text-gray-500 truncate">{conversation.message}</p>
    </div>
  )
}
