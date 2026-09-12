// src/mocks/data.ts

import type { Conversation } from "../types/conversation"

export const conversations: Conversation[] = [
  {
    id: "1",
    ticketId: "TKT-1001",
    customerName: "John",
    customerEmail: "john@example.com",
    customerPhone: "+1-555-0101",
    message: "This is the third time I'm contacting support. I want a refund now.",
    priority: "high",
    status: "pending",
    createdAt: Date.now(),
    escalationReason: "angry_customer",
    waitingSinceMinutes: 42
  },
  {
    id: "2",
    ticketId: "TKT-1002",
    customerName: "Sara",
    customerEmail: "sara@example.com",
    customerPhone: "+1-555-0102",
    message: "Can you help me change my billing address?",
    priority: "medium",
    status: "pending",
    createdAt: Date.now(),
    escalationReason: "edge_case",
    waitingSinceMinutes: 12
  },
  {
    id: "3",
    ticketId: "TKT-1003",
    customerName: "Ahmed",
    customerEmail: "ahmed@example.com",
    customerPhone: "+1-555-0103",
    message: "Your bot keeps giving me the wrong tracking number.",
    priority: "high",
    status: "pending",
    createdAt: Date.now(),
    escalationReason: "low_csat",
    waitingSinceMinutes: 58
  },
  {
    id: "4",
    ticketId: "TKT-1004",
    customerName: "Liam",
    customerEmail: "liam@example.com",
    customerPhone: "+1-555-0104",
    message: "Just wanted to say the bot actually helped, but I have one more question.",
    priority: "low",
    status: "pending",
    createdAt: Date.now(),
    escalationReason: "edge_case",
    waitingSinceMinutes: 5
  },
  {
    id: "5",
    ticketId: "TKT-1005",
    customerName: "Mei",
    customerEmail: "mei@example.com",
    customerPhone: "+1-555-0105",
    message: "This is unacceptable, I've been waiting for a week.",
    priority: "high",
    status: "resolved",
    createdAt: Date.now(),
    escalationReason: "angry_customer",
    waitingSinceMinutes: 90
  },
  {
    id: "6",
    ticketId: "TKT-1006",
    customerName: "Carlos",
    customerEmail: "carlos@example.com",
    customerPhone: "+1-555-0106",
    message: "Can someone confirm my subscription was cancelled?",
    priority: "medium",
    status: "pending",
    createdAt: Date.now(),
    escalationReason: "low_csat",
    waitingSinceMinutes: 33
  }
]
