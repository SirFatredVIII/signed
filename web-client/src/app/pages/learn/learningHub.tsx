import { useContext } from "react";
import { StateContext } from "../../../../context";
import { ModuleTree } from "./moduleTree"
import { RetrieveAllModules, RetrieveModuleById } from "@/app/accessors/modules.accessor";
import { ModulePanel } from "./modulePanel";

/**
 * A page that holds all the materials for learning from new modules
 * or practicing their content. Customers can also access their user
 * settings page here.
 */
export const LearningHub = () => {

    const { state } = useContext(StateContext);

    return (
        <div className={"select-none -mt-15 h-screen " + (state.modulePanelOpen ? "grid-cols-2 grid" : "")}>
            <ModuleTree/>
            {state.modulePanelOpen &&
                <ModulePanel/>
            }
        </div>
    )
}