import { faBookOpenReader, faHouse } from "@fortawesome/free-solid-svg-icons";
import { SidebarItem } from "./sidebarItem";
import { RetrieveLessonsByManyId } from "@/app/accessors/lessons.accessor";
import {
  RetrieveStageById,
  RetrieveStagesByManyId,
  RetrieveStagesOfModule,
} from "@/app/accessors/stages.accessor";
import {
  BaseSyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StateContext } from "../../../../context";
import { Stage } from "@/app/types/lessons";
import { LessonItem } from "./lessonItem";
import { LoadingWrapper } from "@/app/components/loading/loading";
import { LessonContent } from "./lessonContent";
import {
  CompleteLesson,
  CompleteStage,
  ResetLesson,
  RetrieveUser,
} from "@/app/accessors/users.accessor";
import { InputButton } from "@/app/components/input/button";
import { navigateHome, navigateLesson, navigatePractice } from "../utils/nav";

export interface LessonStages {
  id: number;
  stages: Stage[];
}

/**
 * The main page where lessons are conducted. This is the main bulk of a particular module.
 */
export const LessonPage = () => {
  const { state, setState } = useContext(StateContext);
  const [lessons, setLessons] = useState<LessonStages[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [stagesCompleted, setStagesCompleted] = useState<Map<number, number[]>>(
    new Map()
  );
  const [stageCompleted, setStageCompleted] = useState(false);
  const stopCameraRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (state.currentModule !== "na") {
      // Retrieve the lessons and stages of the entire module
      RetrieveStagesOfModule(state.currentModule.id).then((allStages) => {
        setLessons(allStages);

        // Mark the current stages across all lessons that have been completed
        if (state.currentUser !== "na") {
          const lessonsProgress = state.currentUser.history.lessons_progress;

          const stagesCompleted: Map<number, number[]> = new Map();
          lessonsProgress.forEach((lessonProg) => {
            allStages.forEach((otherLesson) => {
              if (lessonProg.lessonid === otherLesson.id) {
                stagesCompleted.set(
                  lessonProg.lessonid,
                  lessonProg.stagesCompleted
                );
              }
            });
          });

          setStagesCompleted(stagesCompleted);
        }
      });

      new Promise((f) => setTimeout(f, 500)).then(() => setLoaded(true));
    }
  }, [state]);

  useEffect(() => {
    let highestLessonId = -1;
    stagesCompleted.keys().forEach((key) => {
      if (key > highestLessonId) {
        highestLessonId = key;
      }
    });

    if (
      lessons.length !== 0 &&
      stagesCompleted.get(highestLessonId)?.length ===
        lessons[lessons.length - 1].stages.length
    ) {
      setState({
        ...state,
        currentPage: "learn",
        currentModule: "na",
        modulePanelOpen: false,
      });
    }
  });

  // should be the first lesson in the list of uncompleted lessons
  const lessonToComplete = lessons.filter((lesson) => {
    let lessonNotMatched = true;
    const completedStagesOfLesson = stagesCompleted.get(lesson.id);
    if (
      completedStagesOfLesson !== undefined &&
      completedStagesOfLesson.length === lesson.stages.length
    ) {
      lessonNotMatched = false;
    }
    return lessonNotMatched;
  })[0];

  // should be the first stage in the list of stages in the current lesson to complete
  let idOfStageToComplete = 0;
  if (stagesCompleted !== undefined && lessonToComplete !== undefined) {
    idOfStageToComplete = lessonToComplete.stages.filter((stage) => {
      let stageNotMatched = true;
      const stagesOfLessonCompleted = stagesCompleted.get(lessonToComplete.id);
      if (stagesOfLessonCompleted !== undefined) {
        stagesOfLessonCompleted.forEach((otherStage) => {
          if (stage.id === otherStage) {
            stageNotMatched = false;
          }
        });
      }
      return stageNotMatched;
    })[0].id;
  }

  let stageToComplete = undefined;
  if (lessonToComplete !== undefined) {
    stageToComplete = lessonToComplete.stages.filter((stage) => {
      let stageMatched = false;
      if (stage.id === idOfStageToComplete) {
        stageMatched = true;
      }
      return stageMatched;
    })[0];
  }

  const advanceToNextStage = (e: BaseSyntheticEvent) => {
    setStageCompleted(false);
    if (stopCameraRef.current) {
      stopCameraRef.current();
    }
    if (
      state.currentUser !== "na" &&
      state.currentModule !== "na" &&
      stageToComplete !== undefined
    ) {
      setLoaded(false);
      CompleteStage(
        state.currentUser.id,
        lessonToComplete.id,
        stageToComplete.id
      ).then(() => {
        if (state.currentUser !== "na") {
          RetrieveUser(state.currentUser.email).then((user) => {
            setState({ ...state, currentUser: user });
          });
        }
        setLoaded(true);
      });
    }
  };

  const restartLesson = (e: BaseSyntheticEvent) => {
    setStageCompleted(false);
    if (stopCameraRef.current) {
      stopCameraRef.current();
    }
    if (state.currentUser !== "na" && state.currentModule !== "na") {
      let lessonToRest =
        state.currentModule.lessons[state.currentModule.lessons.length - 1];
      if (lessonToComplete !== undefined) {
        lessonToRest = lessonToComplete.id;
      }
      ResetLesson(state.currentUser.id, lessonToRest).then(() => {
        if (state.currentUser !== "na") {
          RetrieveUser(state.currentUser.email).then((user) => {
            setState({ ...state, currentUser: user });
          });
        }
      });
    }
  };

  if (!loaded) {
    return <LoadingWrapper />;
  }

  return (
    <div className="grid grid-cols-10">
      <div className="bg-signed-darker-blue col-span-1 h-screen -mt-15 grid-rows-2 grid grid-rows-10">
        <div className="pt-15 border-b-5 border-b-signed-blue row-span-2">
          <SidebarItem
            label="Home"
            active={false}
            action={() => navigateHome({ state, setState })}
            icon={faHouse}
            type="actionItem"
            completed={false}
          />
          <SidebarItem
            label="Learn"
            active={true}
            action={() => navigateLesson({ state, setState })}
            icon={faBookOpenReader}
            type="actionItem"
            completed={false}
          />
          <SidebarItem
            label="Practice"
            active={false}
            action={() => navigatePractice({ state, setState })}
            icon={faBookOpenReader}
            type="actionItem"
            completed={false}
          />
        </div>
        <div className="overflow-y-scroll row-span-8">
          {lessons.map((lesson) => {
            let passedCompletedStages: number[] = [];
            if (stagesCompleted !== undefined) {
              const stagesOfLessonCompleted = stagesCompleted.get(lesson.id);
              if (stagesOfLessonCompleted) {
                passedCompletedStages = stagesOfLessonCompleted;
              }
            }

            let stagesToRender: Stage[] = [];
            if (lessonToComplete !== undefined) {
              stagesToRender = lesson.stages;
            }

            return (
              <LessonItem
                lessonId={lesson.id}
                stages={stagesToRender}
                activeStage={idOfStageToComplete}
                completedStages={passedCompletedStages}
                key={lesson.id}
              />
            );
          })}
        </div>
      </div>
      <div className="bg-signed-light-blue col-span-9">
        {stageToComplete !== undefined && (
          <LessonContent
            stage={stageToComplete}
            stageCompleted={stageCompleted}
            setStageCompleted={setStageCompleted}
            registerStopCamera={(cb) => (stopCameraRef.current = cb)}
          />
        )}
        <div className="flex gap-3 justify-center">
          <InputButton
            color={"green"}
            label={"Advance..."}
            callback={advanceToNextStage}
            disabled={stageToComplete?.type === "practice" && !stageCompleted}
          />
          <InputButton
            color={"red"}
            label={"Restart lesson..."}
            callback={restartLesson}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};
