import { useContext } from "react";
import { StateContext } from "../../../../context";
import { ModuleTree } from "./moduleTree"

/**
 * A page that holds all the materials for learning from new modules
 * or practicing their content. Customers can also access their user
 * settings page here.
 */
export const LearningHub = () => {

    const { state, setState } = useContext(StateContext);

    return (
        <div className={"select-none " + (state.modulePanelOpen ? "grid-cols-2 grid" : "")}>
            <ModuleTree/>
            {state.modulePanelOpen &&
                <div className="bg-signed-blue">
                    <h2 className={"w-full flex justify-center text-4xl pt-30 font-bold select-none text-white"}>Welcome to Module x...</h2>
                </div>
            }
        </div>
    )
}