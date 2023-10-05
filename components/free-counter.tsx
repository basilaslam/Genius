"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MAX_FREE_COUNTS } from "@/constants"
import { Progress } from "@/components/ui/progress"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { userProModal } from "@/hooks/use-pro-modal"

import axios from "axios"


interface freeCounterProps {
    apiLimitCount: number,
    isPro: boolean
}

const FreeCounter = ({apiLimitCount = 0}:freeCounterProps) => {
    const proModal = userProModal()
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])


    if(!mounted){
        return null
    }

    if(isPro){
        return null
    }

    const onSubscribe = async() => {
        try {
            setLoading(true)
            const response = await axios.get("/api/stripe");
            window.location.href = response.data.url
        } catch (error) {
            console.log(error, "STRIPE URL ERROR"); 
        }finally{
            setLoading(false)
        }
    }


    return(
        <div className="px-3">
            <Card className="bg-white/10 border-0">
                <CardContent className="py-6">
                <div className="text-center text-sm text-white mb-4">
                    <p>
                        {apiLimitCount} / { MAX_FREE_COUNTS } Free Generations
                    </p>
                    <Progress className="h-3" value={(apiLimitCount / MAX_FREE_COUNTS) * 100}/>
                </div>

                <Button onClick={proModal.onOpen} className="w-full" variant="premium">
                    Upgrade
                    <Zap className="w-4 h-4 ml-2 fill-white"/>
                </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default FreeCounter