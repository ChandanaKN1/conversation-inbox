import { useState } from "react"
import { AlertCircle, CheckCircle2, Clock, Mail, MessageSquareOff, Phone, Send } from "../icons"
import { escalationLabels, type Conversation } from "../types/conversation"
import { getCustomerAutoReply } from "../api/geminiApi"

type Props = {
  conversation: Conversation | undefined
  onResolve: (id: string) => void
  hasFailed: boolean
}

type ChatMessage = {
  sender: "agent" | "customer"
  text: string
}

const priorityStyles: Record<Conversation["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700"
}

export default function ConversationDetail({ conversation, onResolve, hasFailed }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [replyFailed, setReplyFailed] = useState(false)

  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400">
        <MessageSquareOff className="w-8 h-8" />
        <p>Select a conversation to see details</p>
      </div>
    )
  }

  const isResolved = conversation.status === "resolved"
  const initial = conversation.customerName.charAt(0).toUpperCase()

  const handleSend = async () => {
    const agentText = draft.trim()
    if (!agentText) return

    setMessages(prev => [...prev, { sender: "agent", text: agentText }])
    setDraft("")
    setReplyFailed(false)
    setIsReplying(true)

    try {
      const customerText = await getCustomerAutoReply({
        customerName: conversation.customerName,
        escalationReasonLabel: escalationLabels[conversation.escalationReason],
        originalMessage: conversation.message,
        agentReply: agentText
      })
      setMessages(prev => [...prev, { sender: "customer", text: customerText }])
    } catch {
      setReplyFailed(true)
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-medium">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-gray-900 truncate">{conversation.customerName}</h2>
              <span className="text-xs text-gray-400 shrink-0">#{conversation.ticketId}</span>
            </div>
            <p className="flex items-center gap-1 text-xs text-gray-500 truncate">
              <span className="truncate">{escalationLabels[conversation.escalationReason]}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-0.5 shrink-0">
                <Clock className="w-3 h-3" /> {conversation.waitingSinceMinutes} min
              </span>
            </p>
          </div>
          <span
            className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyles[conversation.priority]}`}
          >
            {conversation.priority}
          </span>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {!isResolved && (
            <kbd className="hidden sm:inline text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
              R
            </kbd>
          )}
          <button
            disabled={isResolved}
            onClick={() => onResolve(conversation.id)}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-transform hover:bg-blue-700 hover:scale-105 disabled:bg-gray-300 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isResolved ? "Resolved" : "Resolve"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs text-gray-500 overflow-x-auto scrollbar-hide">
        <span className="flex items-center gap-1 shrink-0">
          <Mail className="w-3.5 h-3.5" /> {conversation.customerEmail}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <Phone className="w-3.5 h-3.5" /> {conversation.customerPhone}
        </span>
        <a
          href={`tel:${conversation.customerPhone}`}
          className="ml-auto shrink-0 flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Phone className="w-3.5 h-3.5" /> Call
        </a>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 flex flex-col gap-2">
        <div className="max-w-md bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
          <p className="text-sm text-gray-800">{conversation.message}</p>
        </div>

        {messages.map((message, i) =>
          message.sender === "agent" ? (
            <div
              key={i}
              className="max-w-md self-end bg-blue-500 text-white rounded-lg rounded-tr-none px-3 py-2 shadow-sm"
            >
              <p className="text-sm">{message.text}</p>
            </div>
          ) : (
            <div key={i} className="max-w-md bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
              <p className="text-sm text-gray-800">{message.text}</p>
            </div>
          )
        )}

        {isReplying && (
          <div className="max-w-md bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm text-sm text-gray-400">
            {conversation.customerName} is typing…
          </div>
        )}

        {replyFailed && (
          <p className="text-xs text-red-500 self-end">Couldn't get a customer reply. Try sending again.</p>
        )}
      </div>

      {hasFailed && (
        <div className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 border-t border-gray-200 bg-red-50">
          <AlertCircle className="w-4 h-4" />
          Couldn't resolve. Try again.
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-gray-200 p-3">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isReplying}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={isReplying}
          aria-label="Send message"
          className="flex items-center justify-center w-9 h-9 shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
