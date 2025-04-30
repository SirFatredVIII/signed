import { faBookOpenReader, faHouse } from "@fortawesome/free-solid-svg-icons"
import { SidebarItem } from "./sidebarItem"
import { RetrieveLessonsByManyId } from "@/app/accessors/lessons.accessor"
import { RetrieveStagesByManyId } from "@/app/accessors/stages.accessor"
import { useContext, useEffect, useState } from "react"
import { StateContext } from "../../../../context"
import { Lesson as LessonType, Stage } from "@/app/types/lessons"
import { LessonItem } from "./lessonItem"
import { LoadingWrapper } from "@/app/components/loading/loading"
import { LessonContent } from "./lessonContent"

/**
 * The main page where lessons are conducted. This is the main bulk of a particular module.
 */
export const LessonPage = () => {

    const {state, setState} = useContext(StateContext);
    const [lessons, setLessons] = useState<LessonType[]>([]);
    const [stages, setStages] = useState<Stage[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [lessonsCompleted, setLessonsCompleted] = useState<number[]>([]);
    const [stagesCompleted, setStagesCompleted] = useState<number[]>([]);

    useEffect(() => {
        if (state.currentModule !== "na") {
            RetrieveLessonsByManyId(state.currentModule.lessons).then((lessons) => {
                setLessons(lessons);
                lessons.forEach((lesson) => {
                    RetrieveStagesByManyId(lesson.stages).then((stages) => {
                        setStages(stages)
                    })
                })

                if (state.currentUser !== "na") {
                    const lessonsProgress = state.currentUser.history.lessons_progress;

                    const lessonsCompleted: number[] = []
                    const stagesCompleted: number[] = []
                    lessonsProgress.forEach((lessonProg) => {
                        lessons.forEach((otherLesson) => {
                            if (lessonProg.lessonid === otherLesson.id ) {
                                if (lessonProg.stagesCompleted.length === otherLesson.stages.length) {
                                    lessonsCompleted.push(lessonProg.lessonid);
                                } 
                                stagesCompleted.push(...lessonProg.stagesCompleted)
                            }
                        })
                    })
                    setLessonsCompleted(lessonsCompleted);
                    setStagesCompleted(stagesCompleted);
                }
                new Promise(f => setTimeout(f, 500)).then(() => setLoaded(true));
            })
        }
    }, [state])

    console.log(lessonsCompleted)

    const navigateHome = () => {
        setState({...state, currentPage: "learn", currentModule: "na", modulePanelOpen: false})
    }

    const navigatePractice = () => {
        setState({...state, currentPage: "practice"})
    }

    if (!loaded) {
        return (
            <LoadingWrapper/>
        )
    }

    return (
        <div className="grid grid-cols-10">
            <div className="bg-signed-darker-blue col-span-1 h-screen -mt-15">
                <div className="pt-15 border-b-5 border-b-signed-blue">
                    <SidebarItem label="Home" active={false} action={navigateHome} icon={faHouse} type="actionItem"/>
                    <SidebarItem label="Learn" active={true} action={() => {}} icon={faBookOpenReader} type="actionItem"/>
                    <SidebarItem label="Practice" active={false} action={navigatePractice} icon={faBookOpenReader} type="actionItem"/>
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
                <LessonContent source="/a.png" alt="signing 'A' in ASL" stage={stages[0]}/>
            </div>
        </div>
    )
}