import { PuffLoader } from "react-spinners"

/**
 * A wrapper component for loading that looks quite pleasant.
 * Should be used to take up the whole screen.
 */
export const LoadingWrapper = () => {
    return (
        <div className="w-full h-screen -mt-15 flex justify-center items-center bg-signed-light-blue">
            <PuffLoader size={"10vw"} color={"#0F426C"}/>
        </div>
    )
}