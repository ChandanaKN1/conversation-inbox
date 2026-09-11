// src/mocks/data.ts

import type { Conversation } from "../types/conversation"

export const conversations: Conversation[] = [
  {
    id: "1",
    customerName: "John",
    message: "This is the third time I'm contacting support. I want a refund now.",
    priority: "high",
    status: "pending",
    createdAt: Date.now(),
    escalationReason: "angry_customer",
    waitingSinceMinutes: 42
  },
  {
    id: "2",
    customerName: "Sara",
    message: "Can you help me change my billing address?",
    priority: "medium",
    status: "pending",
    createdAt: Date.now(),
    escalationReason: "edge_case",
    waitingSinceMinutes: 12
  },
  {
    id: "3",
    customerName: "Ahmed",
    message: "Your bot keeps giving me the wrong tracking number.",
    priority: "high",
    status: "pending",
    createdAt: Date.now(),
    escalationReason: "low_csat",
    waitingSinceMinutes: 58
  },
  {
    id: "4",
    customerName: "Liam",
    message: "Just wanted to say the bot actually helped, but I have one more question.",
    priority: "low",
    status: "pending",
    createdAt: Date.now(),
    escalationReason: "edge_case",
    waitingSinceMinutes: 5
  },
  {
    id: "5",
    customerName: "Mei",
    message: "This is unacceptable, I've been waiting for a week.",
    priority: "high",
    status: "resolved",
    createdAt: Date.now(),
    escalationReason: "angry_customer",
    waitingSinceMinutes: 90
  },
  {
    id: "6",
    customerName: "Carlos",
    message: "Can someone confirm my subscription was cancelled?",
    priority: "medium",
    status: "pending",
    createdAt: Date.now(),
    escalationReason: "low_csat",
    waitingSinceMinutes: 33
  }
]
