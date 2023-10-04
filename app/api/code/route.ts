import { auth } from "@clerk/nextjs";
import { ok } from "assert";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const instructionMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
    role: "system",
    content: "Act like a perfect code generator. You must answer only in markdown code snippets. Use code comments for explanations."
}

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


        if(!freeTriel && !await checkSubscription()){
            return new NextResponse("Free triel has expired",{status: 403})
        }


        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:[instructionMessage,{"role": 'user', 'content': prompt}]
        })


        let answer = chatCompletion.choices[0].message.content
        
        if(!await checkSubscription()){
            await increaseApiLimit()
          }
          
        return new NextResponse(answer, {status: 200})
    }catch (err){
        console.log("[Conversation_error", err);
        return new NextResponse("Internal error", {status: 500})
    }
}


