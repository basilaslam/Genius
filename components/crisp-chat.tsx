"use client"
import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

const CrispChat = () => {

    useEffect(() =>{
        Crisp.configure("c360c514-6793-4457-8b3e-dae30c653ed0")
    },[])
    return null
}

export default CrispChat