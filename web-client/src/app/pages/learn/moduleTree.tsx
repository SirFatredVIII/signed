import { ModuleItem } from "@/app/components/modules/moduleItem"
import { useContext, useEffect, useState } from "react"
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
    })

    const handlePracticeClick = () => {
        setState({...state, currentPage: "practice"})
    }

    const handleModuleClick = () => {
        setState({...state, modulePanelOpen: !state.modulePanelOpen});
    }

    return (
        <div className="mb-10 mt-15">
            <h1 className={"w-full flex justify-center text-5xl pt-10 font-bold select-none"}>
                Welcome back!
            </h1>
            <div className="grid justify-center gap-20 bg-signed-light-blue p-20 rounded-2xl w-3/4 mt-20 m-auto">
                {
                    modules.map((module) => {
                        return (
                            <ModuleItem title={module.name} disabled={module.id > 0} key={module.id} practiceCallback={handlePracticeClick} moduleCallback={handleModuleClick}/>
                        )
                    })
                }
            </div>
        </div>
    )
}