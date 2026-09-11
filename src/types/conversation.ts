export type Conversation = {
  id: string
  customerName: string
  message: string
  priority: "high" | "medium" | "low"
  status: "pending" | "resolved"
  createdAt: number
  escalationReason: "angry_customer" | "low_csat" | "edge_case"
  waitingSinceMinutes: number
}