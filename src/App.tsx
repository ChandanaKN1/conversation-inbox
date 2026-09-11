import { useEffect, useState } from "react"
import type { Conversation } from "./types/conversation"
import ConversationList from "./components/ConversationList"

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortType, setSortType] = useState<"default" | "highToLow" | "lowToHigh">("default")

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
    try {
      await fetch(`/api/conversations/${id}`, {
        method: "PATCH"
      })

      setConversations(prev =>
        prev.map(c =>
          c.id === id ? { ...c, status: "resolved" } : c
        )
      )
    } catch {
      alert("Failed to resolve conversation")
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

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Conversation Inbox</h1>

      {/* Dropdown */}
      <select value={sortType} onChange={(e) => setSortType(e.target.value as any)}>
        <option value="default">Default</option>
        <option value="highToLow">High → Low</option>
        <option value="lowToHigh">Low → High</option>
      </select>

      <ConversationList conversations={displayConversations} onResolve={handleResolve} />
    </div>
  )
}