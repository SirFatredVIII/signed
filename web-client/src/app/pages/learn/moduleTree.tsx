import { ModuleItem } from "@/app/components/modules/moduleItem"
import { BaseSyntheticEvent, useContext, useEffect, useState } from "react"
import { StateContext } from "../../../../context"
import { Module } from "@/app/types/module";
import { RetrieveAllModules } from "@/app/accessors/modules.accessor";

/**
 * The part of the screen representing the tree of our modules on the landing page.
 */
export const ModuleTree = () => {

    const { state, setState } = useContext(StateContext);
    const [modules, setModules] = useState<Module[]>([])

    useEffect(() => {
        RetrieveAllModules().then((modules) => {setModules(modules)});
    }, [state])

    const handlePracticeClick = (e: BaseSyntheticEvent) => {
        setState({...state, currentPage: "practice"})
    }

    const handleModuleClick = (e: BaseSyntheticEvent) => {

        let newModule: Module | "na" = "na";
        if (state.currentModule === "na") {
            newModule = modules[e.target.id]
        } 
        
        setState({...state, modulePanelOpen: !state.modulePanelOpen, currentModule: newModule});
    }

    let username = ""
    if (state.currentUser !== "na") {
        username = state.currentUser.username;
    }

    return (
        <div className="mb-10">
            <h1 className={"w-full flex justify-center text-5xl pt-30 font-bold select-none"}>
                {"Welcome back, " + username + "!"}
            </h1>
            <div className={"grid justify-center gap-20 bg-signed-light-blue p-20 rounded-2xl w-3/4 mt-20 m-auto"}>
                {
                    modules.map((module) => {
                        return (
                            <ModuleItem key={module.id} module={module} practiceCallback={handlePracticeClick} moduleCallback={handleModuleClick}/>
                        )
                    })
                }
            </div>
        </div>
    )
}