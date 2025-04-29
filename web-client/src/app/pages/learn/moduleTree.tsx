import { ModuleItem } from "@/app/components/modules/moduleItem"
import { useContext } from "react"
import { StateContext } from "../../../../context"

/**
 * The part of the screen representing the tree of our modules on the landing page.
 */
export const ModuleTree = () => {
    
    const { state, setState } = useContext(StateContext);

    const modules = [
        {
            id: 0,
            name: "Module One: ABCs",
            skillLevel: "Beginner",
            prereqs: [],
            signs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        },
        {
            id: 1,
            name: "Module Two: Animals",
            skillLevel: "Beginner",
            prereqs: [0],
            signs: [27, 28, 29],
        },
        {
            id: 2,
            name: "unknown...",
            skillLevel: "Beginner",
            prereqs: [1],
            signs: [-1],
        },
        {
            id: 3,
            name: "unknown...",
            skillLevel: "Beginner",
            prereqs: [1],
            signs: [-1],
        },
        {
            id: 4,
            name: "unknown...",
            skillLevel: "Beginner",
            prereqs: [1],
            signs: [-1],
        },
        {
            id: 5,
            name: "unknown...",
            skillLevel: "Beginner",
            prereqs: [1],
            signs: [-1],
        },
        {
            id: 6,
            name: "unknown...",
            skillLevel: "Beginner",
            prereqs: [1],
            signs: [-1],
        },
        {
            id: 7,
            name: "unknown...",
            skillLevel: "Beginner",
            prereqs: [1],
            signs: [-1],
        },
        {
            id: 8,
            name: "unknown...",
            skillLevel: "Beginner",
            prereqs: [1],
            signs: [-1],
        },
    ]

    const handlePracticeClick = () => {
        setState({...state, currentPage: "practice"})
    }

    const handleModuleClick = () => {
        setState({...state, modulePanelOpen: !state.modulePanelOpen});
    }

    return (
        <div className="grid justify-center mb-10">
            <h1 className={"w-full flex justify-center text-7xl pt-30 font-bold select-none"}>
                Welcome back!
            </h1>
            <div className="grid justify-center mt-20 gap-20 bg-signed-light-blue p-20 rounded-2xl">
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