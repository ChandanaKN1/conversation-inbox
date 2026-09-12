export type Conversation = {
  id: string
  ticketId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  message: string
  priority: "high" | "medium" | "low"
  status: "pending" | "resolved"
  createdAt: number
  escalationReason: "angry_customer" | "low_csat" | "edge_case"
  waitingSinceMinutes: number
}

export const escalationLabels: Record<Conversation["escalationReason"], string> = {
  angry_customer: "Angry customer",
  low_csat: "Low satisfaction score",
  edge_case: "Edge case"
}