import { collection, DocumentData, getDocs, getFirestore, query, where } from "firebase/firestore";
import { config } from "../../../configuration";
import { Lesson } from "../types/lessons";

const database = getFirestore(config);

/**
 * Converts a firebase document to an internal lesson type.
 * @param document the document to convert
 * @returns a lesson representation of the firebase document
 */
const docToLesson = (document: DocumentData) => {
    const lessonToReturn: Lesson = {
        id: document.id,
        stages: document.stages
    }
    return lessonToReturn;
}

/**
 * Accesses the firebase to return the specified lesson by its id.
 * @param id the id of the lesson to return
 * @returns a lesson object
 */
export const RetrieveLessonById = async (id: number) => {
    const q = query(collection(database, "lessons"), where("id", "==", id));

    const docs: DocumentData[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });

    return docToLesson(docs[0]);
}

/**
 * Accesses the firebase to return the specified lessons by their ids.
 * @param ids the list of ids of the lessons to return
 * @returns an array of lessons
 */
export const RetrieveLessonsByManyId = async (ids: number[]) => {
    const q = query(collection(database, "lessons"), where("id", "in", ids));

    const lessons: Lesson[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        lessons.push(docToLesson(doc.data()));
    });

    return lessons;
}