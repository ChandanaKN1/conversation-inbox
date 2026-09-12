import { useEffect, useState } from "react"
import { Inbox } from "./icons"
import type { Conversation } from "./types/conversation"
import ConversationList from "./components/ConversationList"
import ConversationDetail from "./components/ConversationDetail"
import SortDropdown, { type SortType } from "./components/SortDropdown"

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortType, setSortType] = useState<SortType>("default")
  const [failedId, setFailedId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

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
    } catch {
      setFailedId(id)
    }
  }


  const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3
  }

  let displayConversations = [...conversations]

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
            <p className="text-xs text-gray-500">Triage what needs you, resolve it, move on</p>
          </div>
        </div>

        <SortDropdown value={sortType} onChange={setSortType} />
      </header>

      <div className="flex flex-1 min-h-0 gap-3 p-3">
        <div className="w-1/3 bg-white rounded-xl shadow-sm overflow-y-auto scrollbar-hide">
          <ConversationList
            conversations={displayConversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
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
    </div>
  )
}