import { useEffect, useState } from "react"
import type { Conversation } from "./types/conversation"

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Conversation Inbox</h1>

      {conversations.map((c) => (
        <div key={c.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h3>{c.customerName}</h3>
          <p>{c.message}</p>
          <p>Priority: {c.priority}</p>
          <p>Status: {c.status}</p>
        </div>
      ))}
    </div>
  )
}