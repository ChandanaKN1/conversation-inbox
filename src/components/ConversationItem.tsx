import { CheckCircle2, Clock } from "../icons"
import type { Conversation } from "../types/conversation"

type Props = {
  conversation: Conversation
  isSelected: boolean
  onSelect: (id: string) => void
}

const priorityStyles: Record<Conversation["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700"
}

export default function ConversationItem({ conversation, isSelected, onSelect }: Props) {
  const isResolved = conversation.status === "resolved"

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      aria-current={isSelected ? "true" : undefined}
      className={`w-full text-left cursor-pointer border-b border-l-4 border-gray-100 px-4 py-3 transition-all hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset ${
        isSelected ? "border-l-blue-500 bg-blue-50" : "border-l-transparent"
      } ${isResolved ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {isResolved && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
          <h3 className="font-medium text-gray-900 truncate">{conversation.customerName}</h3>
        </div>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyles[conversation.priority]}`}
        >
          {conversation.priority}
        </span>
      </div>

      <p className="text-sm text-gray-500 truncate mt-0.5">{conversation.message}</p>

      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
        <Clock className="w-3 h-3" />
        <span>{conversation.waitingSinceMinutes} min</span>
      </div>
    </button>
  )
}
