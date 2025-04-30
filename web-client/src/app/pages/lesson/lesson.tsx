import { faBookOpenReader, faHouse } from "@fortawesome/free-solid-svg-icons"
import { SidebarItem } from "./sidebarItem"
import { RetrieveLessonById, RetrieveLessonsByManyId } from "@/app/accessors/lessons.accessor"
import { RetrieveStageById, RetrieveStagesByManyId } from "@/app/accessors/stages.accessor"
import { useContext, useEffect, useState } from "react"
import { StateContext } from "../../../../context"
import { Lesson as LessonType, Stage } from "@/app/types/lessons"
import { LessonItem } from "./lessonItem"

/**
 * The main page where lessons are conducted. This is the main bulk of a particular module.
 */
export const LessonPage = () => {

    const {state} = useContext(StateContext);
    const [lessons, setLessons] = useState<LessonType[]>([]);
    const [stages, setStages] = useState<Stage[]>([]);

    useEffect(() => {
        if (state.currentModule !== "na") {
            RetrieveLessonsByManyId([0]).then((lessons) => {
                setLessons(lessons);
                lessons.forEach((lesson) => {
                    RetrieveStagesByManyId(lesson.stages).then((stages) => {
                        setStages(stages)
                    })
                })
            })
        }
    }, [state])

    return (
        <>
        <div className="grid grid-cols-10">
            <div className="bg-signed-darker-blue col-span-1 h-screen -mt-15">
                <div className="pt-15 border-b-5 border-b-signed-blue">
                    <SidebarItem label="Home" active={false} action={() => {}} icon={faHouse} type="actionItem"/>
                    <SidebarItem label="Learn" active={true} action={() => {}} icon={faBookOpenReader} type="actionItem"/>
                    <SidebarItem label="Practice" active={false} action={() => {}} icon={faBookOpenReader} type="actionItem"/>
                </div>
                {
                    lessons.map((lesson) => {
                        return (
                            <LessonItem lesson={lesson} stages={stages} key={lesson.id}/>
                        )
                    })
                }
            </div>
            <div className="bg-signed-light-blue col-span-9">
                mainarea content
            </div>
        </div>
        </>
    )
}