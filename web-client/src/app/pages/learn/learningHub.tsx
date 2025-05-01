import { useContext, useState } from "react";
import { StateContext } from "../../../../context";
import { ModuleTree } from "./moduleTree"
import { ModulePanel } from "./modulePanel";
import { LoadingWrapper } from "@/app/components/loading/loading";

/**
 * A page that holds all the materials for learning from new modules
 * or practicing their content. Customers can also access their user
 * settings page here.
 */
export const LearningHub = () => {

    const { state } = useContext(StateContext);
    const [loaded, setLoaded] = useState(false);

    const style = loaded ? "select-none -mt-15 h-screen " + (state.modulePanelOpen ? "grid-cols-2 grid" : "") : ""

    return (
        <>
            <div className={style}>
                <ModuleTree loaded={loaded} setLoaded={setLoaded}/>
                {state.modulePanelOpen &&
                    <ModulePanel/>
                }
            </div>
            {!loaded &&
                <LoadingWrapper/>
            }
        </>
    )
}