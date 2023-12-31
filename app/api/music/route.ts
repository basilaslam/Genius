import { auth } from "@clerk/nextjs";
import { ok } from "assert";
import { NextResponse } from "next/server";
import Replicate from 'replicate'
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: Request){
    try{
        const { userId } = auth()
        const body = await req.json()
        const { prompt } = body

        if(!userId){
            return new NextResponse("Unauthrized", {status: 401})
        }


        if(!prompt) {
            return new NextResponse("Messages are required", {status: 400})
        }


        const freeTriel = await checkApiLimit()

        if(!freeTriel && !await checkSubscription()){
            return new NextResponse("Free triel has expired",{status: 403})
        }


        const output = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
              input: {
                prompt_a: prompt
              }
            })
            if(!await checkSubscription()){
                await increaseApiLimit()
              }        return NextResponse.json(output, {status: 200})
    }catch (err){
        console.log("[Music_error", err);
        return new NextResponse("Internal error", {status: 500})
    }
}


