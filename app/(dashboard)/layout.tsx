import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { apiLimitCounter } from "@/lib/api-limit"
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({children}:{children:React.ReactNode}) =>{

    const apiLimitCount: number = await apiLimitCounter();
    const isPro = await checkSubscription()
    return (
        <div className="h-full relative">
            <div className=" hidden h-full md:flex md:flex-col md:w-72 md:fixed md:inset-y-0  z-[80] bg-gray-900">
                <Sidebar apiLimitCount={apiLimitCount} isPro={isPro}/>
            </div>

            <main className="md:pl-72">
                <Navbar apiLimitCount={apiLimitCount} isPro={isPro}/>
            {children}
            </main>
        </div>
    )
}

export default DashboardLayout