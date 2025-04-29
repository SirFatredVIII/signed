import { useContext } from "react"
import { StateContext } from "../../../../context"

/**
 * Side panel that shows some of the information regarding the module. 
 */
export const ModulePanel = () => {

    const {state, setState} = useContext(StateContext);

    let title = "na";
    if (state.currentModule !== "na") {
        title = state.currentModule.name;
    }

    return (
        <div className="bg-signed-blue">
            <h2 className={"w-full flex justify-center text-4xl pt-30 font-bold select-none text-white"}>{title}</h2>
        </div>
    )
}