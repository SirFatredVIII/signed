import { BaseSyntheticEvent, useContext } from "react"
import { StateContext } from "../../../../context"
import Image from "next/image";
import { InputButton } from "@/app/components/input/button";

/**
 * Side panel that shows some of the information regarding the module. 
 */
export const ModulePanel = () => {

    const {state, setState} = useContext(StateContext);

    let title = "na";
    let description = "na";
    if (state.currentModule !== "na") {
        title = state.currentModule.name;
        description = state.currentModule.description;
    }

    const handleStart = (e: BaseSyntheticEvent) => {
        setState({...state, currentPage: "lesson"});
    }

    const handlePractice = (e: BaseSyntheticEvent) => {
        setState({...state, currentPage: "practice"});
    }

    return (
        <div className="bg-signed-blue">
            <h2 className={"w-full flex justify-center text-4xl pt-30 font-bold select-none text-white"}>{title}</h2>
            <div className="w-full">
                <Image src={"/abc.gif"} alt={"a hand signing the ASL alphabet"} width={"300"} height={"300"} className="m-auto outline-5 outline-signed-darker-blue mt-10"></Image>
            </div>
            <div className="w-full flex justify-center">
                <h2 className={"w-9/10 text-2xl mt-10 font-bold italic select-none text-white p-10 text-center bg-signed-dark-blue outline-5 outline-signed-darker-blue rounded-3xl"}>{description}</h2>
            </div>
            <div className="w-full grid grid-cols-2 mt-10">
                <InputButton color={"green"} label={"Let's get started!"} callback={handleStart} disabled={false}/>
                <InputButton color={"teal"} label={"Let's practice..."} callback={handlePractice} disabled={false}/>
            </div>
        </div>
    )
}