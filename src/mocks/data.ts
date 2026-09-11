// src/mocks/data.ts

import type { Conversation } from "../types/conversation"

export const conversations: Conversation[] = [
  {
    id: "1",
    customerName: "John",
    message: "I am very unhappy",
    priority: "high",
    status: "pending",
    createdAt: Date.now()
  },
  {
    id: "2",
    customerName: "Sara",
    message: "Need help",
    priority: "medium",
    status: "pending",
    createdAt: Date.now()
  }
]