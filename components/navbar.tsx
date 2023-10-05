import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import MobileSidebar from "./mobile-sidebar"

interface NavbarProps {
    apiLimitCount: number,
    isPro: boolean
}


const Navbar = ({ apiLimitCount = 0, isPro = false }:NavbarProps) => {
return (
    <div className="flex items-center p-4">
        <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro}/>


        <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/"></UserButton>
        </div>
    </div>
)
}

export default Navbar