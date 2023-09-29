import { auth } from "@clerk/nextjs";
import { ok } from "assert";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request){
    try{
        const { userId } = auth()
        const body = await req.json()
        const { prompt } = body

        if(!userId){
            return new NextResponse("Unauthrized", {status: 401})
        }

        if(!openai.apiKey){
            return new NextResponse("Open Ai Api Key not configured", {status: 500})
        }


        if(!prompt) {
            return new NextResponse("Messages are required", {status: 400})
        }

        const freeTriel = await checkApiLimit()

    if(!freeTriel){
        return new NextResponse("Free triel has expired",{status: 403})
    }
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:[{"role": 'user', 'content': prompt}]
        })

        let answer = chatCompletion.choices[0].message.content
        
        await increaseApiLimit()
        return new NextResponse(answer, {status: 200})
    }catch (err){
        console.log("[Conversation_error", err);
        return new NextResponse("Internal error", {status: 500})
    }
}


