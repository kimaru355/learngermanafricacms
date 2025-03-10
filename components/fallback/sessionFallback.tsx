import Image from "next/image";

export default function SessionFallback() {
    return (
        <div className="flex justify-center items-center w-full h-[80vh]">
            <Image
                src="/logo.svg"
                priority={true}
                alt="404"
                width={200}
                height={200}
                className="animate-pulse"
            />
        </div>
    );
}
