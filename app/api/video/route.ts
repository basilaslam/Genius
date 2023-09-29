import { auth } from "@clerk/nextjs";
import { ok } from "assert";
import { NextResponse } from "next/server";
import Replicate from 'replicate'
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

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

        if(!freeTriel){
            return new NextResponse("Free triel has expired",{status: 403})
        }


        const output = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
              input: {
                prompt
              }
            }
          );
          await increaseApiLimit()
        return NextResponse.json(output, {status: 200})
    }catch (err){
        console.log("[Music_error", err);
        return new NextResponse("Internal error", {status: 500})
    }
}


