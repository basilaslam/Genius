import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prisma.db";
import { stripe } from "@/lib/stripe";
import { absoluteURL } from "@/lib/utils";
import { metadata } from "@/app/layout";


const settingsUrl = absoluteURL('/settings')

export const GET = async () => {
    try{
        const { userId } = auth()
        const user = await currentUser()

        if(!user || !userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const userSubscription = await prismadb.userSubscription.findUnique({
            where: {
                userId
            }
        })

        if(userSubscription && userSubscription.stripeCustomerId){
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });


            return new NextResponse(JSON.stringify({url: stripeSession.url}))

        }

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
            {
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: "Genius Pro",
                        description: "Unlimited AI Generations"
                    },
                    unit_amount: 2000,
                    recurring: {
                        interval: "month"
                    }
                },
                quantity: 1,
            },
        ],
        metadata: {
            userId,
        }
   
    })


    return new NextResponse(JSON.stringify({url: stripeSession.url}))

    }catch (err){
        console.log('stripe error');
    }
}