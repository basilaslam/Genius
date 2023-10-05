"use client"
import { userProModal } from "@/hooks/use-pro-modal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { tools } from "@/constants"
import { Card } from "./ui/card"
import { cn } from "@/lib/utils"
import { Check, Zap } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import axios from "axios"

export const ProModal = () => {
    const [isMounted, setIsMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const proModal = userProModal()

    const onSubscribe = async() => {
        try {
            setIsLoading(true)
            const response = await axios.get("/api/stripe");
            window.location.href = response.data.url
        } catch (error) {
            console.log(error, "STRIPE URL ERROR"); 
        }finally{
            setIsLoading(false)
        }
    }

    return(
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex justify-center items-center
                    flex-col gap-y-4 pb-2">
                            <div className="flex items-center gap-x-2 font-bold py-1">
                            Upgrade to Genius
                                <Badge variant="premium" className="uppercase text-sm py-1">
                                    Pro
                                </Badge>
                            </div>
                        </DialogTitle>
                        <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                        {tools.map((tool, index) => (
                            <Card key={index} className="p-3 border-black/5 flex items-center justify-between">
                                <div className="flex items-center gap-x-4">
                                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                        <tool.icon className={cn("w-6 h-6",tool.color)}/>
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {tool.label}
                                    </div>
                                </div>
                                    <Check className="text-primary w-5 h-5"/>
                            </Card>
                        ))}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={onSubscribe} size="lg" variant="premium" className="w-full">
                            Upgrade
                            <Zap className="w-4 h-4 ml-2"/>
                        </Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}