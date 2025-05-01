import { faBookOpenReader, faHouse } from "@fortawesome/free-solid-svg-icons"
import { SidebarItem } from "./sidebarItem"
import { RetrieveLessonsByManyId } from "@/app/accessors/lessons.accessor"
import { RetrieveStageById, RetrieveStagesByManyId } from "@/app/accessors/stages.accessor"
import { BaseSyntheticEvent, useContext, useEffect, useState } from "react"
import { StateContext } from "../../../../context"
import { Lesson as LessonType, Stage } from "@/app/types/lessons"
import { LessonItem } from "./lessonItem"
import { LoadingWrapper } from "@/app/components/loading/loading"
import { LessonContent } from "./lessonContent"
import { CompleteLesson, CompleteStage, ResetLesson, RetrieveUser } from "@/app/accessors/users.accessor"
import { InputButton } from "@/app/components/input/button"

/**
 * The main page where lessons are conducted. This is the main bulk of a particular module.
 */
export const LessonPage = () => {

    const {state, setState} = useContext(StateContext);
    const [lessons, setLessons] = useState<LessonType[]>([]);
    const [stages, setStages] = useState<Stage[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [lessonsCompleted, setLessonsCompleted] = useState<number[]>([]);
    const [stagesCompleted, setStagesCompleted] = useState<Map<number, number[]>>(new Map());

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
                    const stagesCompleted: Map<number, number[]> = new Map();
                    lessonsProgress.forEach((lessonProg) => {
                        lessons.forEach((otherLesson) => {
                            if (lessonProg.lessonid === otherLesson.id ) {
                                if (lessonProg.stagesCompleted.length === otherLesson.stages.length) {
                                    lessonsCompleted.push(lessonProg.lessonid);
                                } 
                                stagesCompleted.set(lessonProg.lessonid, lessonProg.stagesCompleted)
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

    // should be the first lesson in the list of uncompleted lessons
    const lessonToComplete = lessons.filter((lesson) => {
        let lessonNotMatched = true;
        lessonsCompleted.forEach((otherLessonId) => {
            if (lesson.id === otherLessonId)  {
                lessonNotMatched = false;
            }
        })
        return lessonNotMatched;
    })[0]

    let idOfStageToComplete = -1;
    if (stagesCompleted !== undefined && lessonToComplete !== undefined) {
        // should be the first stage in the list of stages in the current lesson to complete
        idOfStageToComplete = lessonToComplete.stages.filter((stage) => {
            let stageNotMatched = true;
            stagesCompleted.get(lessonToComplete.id)?.forEach((otherStage) => {
                if (stage === otherStage)  {
                    stageNotMatched = false;
                }
            })
            return stageNotMatched;
        })[0]
    }

    const stageToComplete = stages.filter((stage) => {
        let stageMatched = false;
        if (stage.id === idOfStageToComplete) {
            stageMatched = true;
        }
        return stageMatched;
    })[0];

    if (stageToComplete === undefined) {

    }

    const navigateHome = () => {
        setState({...state, currentPage: "learn", currentModule: "na", modulePanelOpen: false})
    }

    const navigatePractice = () => {
        setState({...state, currentPage: "practice"})
    }

    const advanceToNextStage = (e: BaseSyntheticEvent) => {
        if (state.currentUser !== "na" && state.currentModule !== "na") {
            CompleteStage(state.currentUser.id, lessonToComplete.id, stageToComplete.id).then(() => {
                if (state.currentUser !== "na") {
                    RetrieveUser(state.currentUser.email).then((user) => {
                        setState({...state, currentUser: user});
                    })
                }
            })
        }
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
                    <SidebarItem label="Home" active={false} action={navigateHome} icon={faHouse} type="actionItem" completed={false}/>
                    <SidebarItem label="Learn" active={true} action={() => { } } icon={faBookOpenReader} type="actionItem" completed={false}/>
                    <SidebarItem label="Practice" active={false} action={navigatePractice} icon={faBookOpenReader} type="actionItem" completed={false}/>
                </div>
                {
                    lessons.map((lesson) => {
                        let passedCompletedStages: number[] = []
                        if (stagesCompleted !== undefined) {
                            const stagesOfLessonCompleted = stagesCompleted.get(lesson.id);
                            if (stagesOfLessonCompleted) {
                                passedCompletedStages = stagesOfLessonCompleted;
                            }
                        }

                        return (
                            <LessonItem lesson={lesson} stages={stages} activeStage={idOfStageToComplete} completedStages={passedCompletedStages} key={lesson.id}/>
                        )
                    })
                }
            </div>
            <div className="bg-signed-light-blue col-span-9">
                {stageToComplete !== undefined &&
                    <LessonContent stage={stageToComplete} onComplete={() => {}}/>
                }
                <InputButton color={"green"} label={"Advance..."} callback={advanceToNextStage} disabled={false}/>
            </div>
        </div>
    )
}