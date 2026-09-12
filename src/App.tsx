import { useEffect, useState } from "react"
import { Inbox } from "./icons"
import type { Conversation } from "./types/conversation"
import ConversationList from "./components/ConversationList"
import ConversationDetail from "./components/ConversationDetail"
import SortDropdown, { type SortType } from "./components/SortDropdown"
import EscalationFilter, { type FilterValue } from "./components/EscalationFilter"

const currentAgent = {
  name: "Priya Sharma",
  role: "CX Agent"
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortType, setSortType] = useState<SortType>("default")
  const [filterReason, setFilterReason] = useState<FilterValue>("all")
  const [failedId, setFailedId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [undoId, setUndoId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/conversations")

        if (!res.ok) throw new Error("Failed")

        const data = await res.json()
        setConversations(data)
      } catch {
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Sped up for demo visibility — a real product would tick once a minute.
    const interval = setInterval(() => {
      setConversations(prev =>
        prev.map(c =>
          c.status === "pending" ? { ...c, waitingSinceMinutes: c.waitingSinceMinutes + 1 } : c
        )
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!undoId) return
    const timer = setTimeout(() => setUndoId(null), 5000)
    return () => clearTimeout(timer)
  }, [undoId])

  const handleResolve = async (id: string) => {
    setFailedId(null)
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "PATCH"
      })

      if (!res.ok) throw new Error("Failed")

      setConversations(prev =>
        prev.map(c =>
          c.id === id ? { ...c, status: "resolved" } : c
        )
      )
      setUndoId(id)
    } catch {
      setFailedId(id)
    }
  }

  const handleUndo = () => {
    if (!undoId) return
    setConversations(prev =>
      prev.map(c => (c.id === undoId ? { ...c, status: "pending" } : c))
    )
    setUndoId(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId || e.key.toLowerCase() !== "r") return

      const target = e.target as HTMLElement
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
      if (isTyping) return

      const current = conversations.find(c => c.id === selectedId)
      if (current && current.status === "pending") {
        e.preventDefault()
        handleResolve(selectedId)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedId, conversations, handleResolve])


  const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3
  }

  const displayConversations = [...conversations]

  if (sortType === "highToLow") {
    displayConversations.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    )
  }

  if (sortType === "lowToHigh") {
    displayConversations.sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    )
  }

  const filteredConversations =
    filterReason === "all"
      ? displayConversations
      : displayConversations.filter(c => c.escalationReason === filterReason)

  const selectedConversation = conversations.find(c => c.id === selectedId)

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Inbox className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Conversation Inbox</h1>
            <p className="text-xs text-gray-500">Know what needs you. Act fast.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SortDropdown value={sortType} onChange={setSortType} />

          <div className="flex items-center gap-2.5 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xs font-semibold">
              PS
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-medium text-gray-900">{currentAgent.name}</p>
              <p className="text-xs text-gray-500">{currentAgent.role}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 gap-3 p-3">
        <div className="w-1/3 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
          <EscalationFilter value={filterReason} onChange={setFilterReason} />
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <ConversationList
              conversations={filteredConversations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
          <ConversationDetail
            key={selectedId}
            conversation={selectedConversation}
            onResolve={handleResolve}
            hasFailed={selectedId !== null && selectedId === failedId}
          />
        </div>
      </div>

      {undoId && (
        <div className="fixed bottom-5 right-5 flex items-center gap-3 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg">
          <span>Conversation resolved</span>
          <button onClick={handleUndo} className="font-medium text-blue-300 hover:text-blue-200">
            Undo
          </button>
        </div>
      )}
    </div>
  )
}