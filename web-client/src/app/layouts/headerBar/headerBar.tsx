import Image from "next/image"

/**
 * Simple header bar for use on our layout.
 */
export const HeaderBar = () => {
    return (
        <div className="bg-signed-darker-blue w-full h-15 absolute sticky top-0 left-0 shadow-lg select-none">
            <Image src={"/logo.png"} alt={"signed-icon"} height={500} width={128} className="w-40 pl-5" priority={true} draggable={false}/>
        </div>
    )
}