import {http,HttpResponse} from 'msw'
import { conversations } from './data'

export const handlers =[
    http.get("/api/conversations",async()=>{
        await new Promise(res=>setTimeout(res,300))
        return HttpResponse.json(conversations)
    })
]