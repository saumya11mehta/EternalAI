import { orbitron } from "@/app/fonts"
import Logo from "@/image/logo/Logo"
import GeminiLogo from "@/image/logo/GeminiLogo"

const EmptyChat = () => {
    return(
        <div className="flex flex-grow justify-center items-center align-middle">
            <div className="text grid grid-flow-row auto-rows-min items-center justify-center ">
                <div className="flex items-center justify-center align-bottom ">
                    <Logo className="w-1/6 p-3"/>
                    <div className={orbitron.className + " text-6xl bold eternal-gradient"}>
                        ETERNAL CHAT
                    </div>
                </div>
                <div className="flex mr-4 items-baseline justify-end"><span className="mr-2">powered by </span><GeminiLogo className="w-1/12"/></div>
            </div>
        </div>
    )
}

export default EmptyChat