export type Conversation = {
  id: string
  customerName: string
  message: string
  priority: "high" | "medium" | "low"
  status: "pending" | "resolved"
  createdAt: number
}