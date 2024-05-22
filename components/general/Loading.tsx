import Logo from "@/image/logo/Logo";

const Loading = () => {
    
    
    return (
        <div className="flex w-full h-screen bg-black items-center justify-center">
            <Logo className="animate-spin-slow" width="100" height="100"/>
        </div>
    );
}

export default Loading