import { http, HttpResponse } from 'msw'
import { conversations } from './data'

export const handlers = [
    http.get("/api/conversations", async () => {
        await new Promise(res => setTimeout(res, 300))
        return HttpResponse.json(conversations)
    }),

    http.patch("/api/conversations/:id", async ({ params }) => {
        await new Promise(res => setTimeout(res, 300))

        const { id } = params
        const convo = conversations.find(c => c.id === id)

        if (!convo) {
            return HttpResponse.json({ message: "Not found" }, { status: 404 })
        }

        if (Math.random() < 0.3) {
            return HttpResponse.error()
        }

        convo.status = "resolved"
        return HttpResponse.json(convo)
    })
]