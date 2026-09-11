import { useEffect, useState } from "react"
import type { Conversation } from "./types/conversation"
import ConversationList from "./components/ConversationList"
import ConversationDetail from "./components/ConversationDetail"

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortType, setSortType] = useState<"default" | "highToLow" | "lowToHigh">("default")
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
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">Conversation Inbox</h1>

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as any)}
          className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
        >
          <option value="default">Default</option>
          <option value="highToLow">High → Low</option>
          <option value="lowToHigh">Low → High</option>
        </select>
      </header>

      <div className="flex flex-1 min-h-0">
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <ConversationList
            conversations={displayConversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="flex-1">
          <ConversationDetail
            conversation={selectedConversation}
            onResolve={handleResolve}
            hasFailed={selectedId !== null && selectedId === failedId}
          />
        </div>
      </div>
    </div>
  )
}