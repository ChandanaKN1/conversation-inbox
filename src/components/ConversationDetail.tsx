import type { Conversation } from "../types/conversation"

type Props = {
  conversation: Conversation | undefined
  onResolve: (id: string) => void
  hasFailed: boolean
}

const priorityStyles: Record<Conversation["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700"
}

const escalationLabels: Record<Conversation["escalationReason"], string> = {
  angry_customer: "Angry customer",
  low_csat: "Low satisfaction score",
  edge_case: "Edge case"
}

export default function ConversationDetail({ conversation, onResolve, hasFailed }: Props) {
  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a conversation to see details
      </div>
    )
  }

  const isResolved = conversation.status === "resolved"
  const initial = conversation.customerName.charAt(0).toUpperCase()

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
            {initial}
          </div>
          <div className="min-w-0">
            <h2 className="font-medium text-gray-900 truncate">{conversation.customerName}</h2>
            <p className="text-xs text-gray-500 truncate">
              {escalationLabels[conversation.escalationReason]} · Waiting {conversation.waitingSinceMinutes} min
            </p>
          </div>
          <span
            className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyles[conversation.priority]}`}
          >
            {conversation.priority}
          </span>
        </div>

        <button
          disabled={isResolved}
          onClick={() => onResolve(conversation.id)}
          className="shrink-0 bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isResolved ? "Resolved" : "Resolve"}
        </button>
      </div>

      <div className="flex-1 bg-gray-50 p-4">
        <div className="max-w-md bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
          <p className="text-sm text-gray-800">{conversation.message}</p>
        </div>
      </div>

      {hasFailed && (
        <div className="px-4 py-2 text-sm text-red-600 border-t border-gray-200 bg-red-50">
          Couldn't resolve. Try again.
        </div>
      )}
    </div>
  )
}
