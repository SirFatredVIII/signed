import { collection, DocumentData, getDocs, getFirestore, query, where } from "firebase/firestore";
import { config } from "../../../configuration";
import { Lesson, Stage } from "../types/lessons";
import { RetrieveLessonById, RetrieveLessonsByManyId } from "./lessons.accessor";
import { RetrieveModuleById } from "./modules.accessor";
import { LessonStages } from "../pages/lesson/lesson";

const database = getFirestore(config);

/**
 * Converts a firebase document to an internal stage type.
 * @param document the document to convert
 * @returns a stage representation of the firebase document
 */
const docToStage = (document: DocumentData) => {
    const stageToReturn: Stage = {
        id: document.id,
        title: document.title,
        description: document.description,
        sign: document.sign,
        type: document.type,
        src: document.src
    }
    return stageToReturn;
}

/**
 * Accesses the firebase to return the specified stage by its id.
 * @param id the id of the stage to return
 * @returns a stage object
 */
export const RetrieveStageById = async (id: number) => {
    const q = query(collection(database, "stages"), where("id", "==", id));

    const docs: DocumentData[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });

    return docToStage(docs[0]);
}

/**
 * Accesses the firebase to return the specified stages by their ids.
 * @param ids the list of ids of the stages to return
 * @returns an array of stages
 */
export const RetrieveStagesByManyId = async (ids: number[]) => {
    const q = query(collection(database, "stages"), where("id", "in", ids));

    const stages: Stage[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        stages.push(docToStage(doc.data()));
    });

    return stages;
}

/**
 * Accesses the firebase to return the specified stages and lessons from a module.
 * @param lessonid the id of the module from which to return all stages and lessons
 * @returns a mapping of lessonids to stageids
 */
export const RetrieveStagesOfModule = async (moduleid: number) => {
    const module = await RetrieveModuleById(moduleid);
    const lessons: Lesson[] = await RetrieveLessonsByManyId(module.lessons);
    const allStageIds: number[] = []

    lessons.forEach((lesson) => {
        allStageIds.push(...lesson.stages);
    })

    const allStages = await RetrieveStagesByManyId(allStageIds);
    const moduleStages: LessonStages[] = lessons.map((lesson) => {
        const stagesToAppend: Stage[] = []
        lesson.stages.forEach((stageId) => {
            allStages.forEach((otherStage) => {
                if (stageId === otherStage.id) {
                    stagesToAppend.push(otherStage);
                }
            })
        })
        return {
            id: lesson.id,
            stages: stagesToAppend
        }
    })


    return moduleStages;
}