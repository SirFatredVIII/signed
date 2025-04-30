import { Lesson, Stage } from "@/app/types/lessons"
import { SidebarItem } from "./sidebarItem"

interface LessonItemProps {
    lesson: Lesson
    stages: Stage[]
}

/**
 * A category on the sidebar, which holds different lessons.
 */
export const LessonItem: React.FC<LessonItemProps> = ({lesson, stages}) => {
    return (
    <div className="border-b-5 border-b-signed-blue select-none">
        <h2 className={"text-white pl-3 pt-3 font-bold"}>Lesson {lesson.id + 1}</h2>
        {
            stages.map((stage) => {
                return (
                    <SidebarItem label={stage.title} active={stage.id === 0} action={() => {}} icon={undefined} type="lessonItem" key={stage.id}/>
                )
            })
        }
    </div>
    )
}