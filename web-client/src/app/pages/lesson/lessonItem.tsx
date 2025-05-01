import { Lesson, Stage } from "@/app/types/lessons"
import { SidebarItem } from "./sidebarItem"

interface LessonItemProps {
    lesson: Lesson
    stages: Stage[]
    activeStage: number
    completedStages: number[];
}

/**
 * A category on the sidebar, which holds different lessons.
 */
export const LessonItem: React.FC<LessonItemProps> = ({lesson, stages, activeStage, completedStages}) => {
    return (
    <div className="border-b-5 border-b-signed-blue select-none">
        <h2 className={"text-white pl-3 pt-3 font-bold"}>Lesson {lesson.id + 1}</h2>
        {
            stages.map((stage) => {

                let isCompleted = false;
                completedStages.forEach((otherStage) => {
                    if (stage.id === otherStage) {
                        isCompleted = true;
                    }
                })

                return (
                    <SidebarItem label={stage.title} active={activeStage === stage.id} completed={isCompleted} action={() => {}} icon={undefined} type="lessonItem" key={stage.id}/>
                )
            })
        }
    </div>
    )
}