import { ModuleItem } from "@/app/components/modules/moduleItem"
import { BaseSyntheticEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { StateContext } from "../../../../context"
import { Module } from "@/app/types/module";
import { RetrieveAllModules } from "@/app/accessors/modules.accessor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";

interface ModuleTreeProps {
    loaded: boolean;
    setLoaded: Dispatch<SetStateAction<boolean>>;
}

/**
 * The part of the screen representing the tree of our modules on the landing page.
 */
export const ModuleTree: React.FC<ModuleTreeProps> = ({loaded, setLoaded}) => {

    const { state, setState } = useContext(StateContext);
    const [modules, setModules] = useState<Module[]>([])

    useEffect(() => {
        RetrieveAllModules().then((modules) => {setModules(modules); setLoaded(true);});
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

    const handleUserSettingsClick = (e: BaseSyntheticEvent) => {
        setState({...state, modulePanelOpen: false, currentModule: "na", currentPage: "userSettings"});
    }

    let username = ""
    if (state.currentUser !== "na") {
        username = state.currentUser.username;
    }

    if (!loaded) {
        return (<></>)
    }

    return (
        <div className="mb-10">
            <div className="flex justify-end pt-20">
                <FontAwesomeIcon icon={faUserGear} onClick={handleUserSettingsClick} className="text-7xl pr-5 text-signed-blue hover:text-signed-dark-blue hover:cursor-pointer"/>
            </div>
            <h1 className={"w-full flex justify-center text-5xl pt-10 font-bold select-none"}>
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