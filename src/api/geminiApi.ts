const MODEL = "gemini-flash-latest"

type AutoReplyParams = {
  customerName: string
  escalationReasonLabel: string
  originalMessage: string
  agentReply: string
}

export async function getCustomerAutoReply(params: AutoReplyParams): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY")
  }

  const prompt = `You are roleplaying as ${params.customerName}, a customer in a support chat.
Your original issue: "${params.originalMessage}"
Reason this was escalated to a human agent: ${params.escalationReasonLabel}.
The support agent just replied: "${params.agentReply}"

Write ${params.customerName}'s next reply in the chat. Stay in character, keep it short (1-2 sentences), and match the tone implied by the escalation reason. Reply with only the message text, no quotes or labels.`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  )

  if (!res.ok) {
    throw new Error("Gemini request failed")
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error("No reply from Gemini")
  }

  return text.trim()
}
