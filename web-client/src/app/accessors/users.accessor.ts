import { collection, doc, DocumentData, getDoc, getDocs, getFirestore, query, QueryDocumentSnapshot, setDoc, where } from "firebase/firestore";
import { config } from "../../../configuration";
import { hashSync } from "bcrypt-ts";
import { secret } from "../pages/auth/secret_salt";
import { User, UserHistory } from "../types/user";
import { RetrieveLessonById } from "./lessons.accessor";
import { RetrieveStageById } from "./stages.accessor";

/**
 * Used to hash the password according to the bcrypt standard. Requires a secret
 * salt, which you should ask Drew for if you need it.
 * @param password the password to encrypt
 * @returns the hashed password
 */
const hashPassword = (password: string) => {return hashSync(password, secret)};

/**
 * Converts a firebase document to an internal user type.
 * @param document the document to convert
 * @returns a user representation of the firebase document
 */
const docToUser = (document: DocumentData) => {
    const stageToReturn: User = {
        id: document.id,
        username: document.username,
        email: document.email,
        pass: document.pass,
        avatar: document.avatar,
        type: document.type,
        history: document.history,
        permissions: document.permissions
    }
    return stageToReturn;
}

const database = getFirestore(config);

/**
 * Accesses the firebase to create a brand new user in the Users document. 
 * @param username the username of the profile to add
 * @param newId the newest identifier, used to both name the entry and the internal id
 * @param password an unhashed password, which will get hashed during the process a creating a new user
 * @param email the new profile's email address
 */
export const CreateNewUser = async (username: string, newId: number, password: string, email: string) => {

    return setDoc(doc(collection(database, "users"), username + "_" + newId), {
        id: newId,
        username: username,
        pass: hashPassword(password),
        email: email,
        type: "customer",
        avatar: "na",
        history: {
            modules_started: [-1],
            modules_finished: [-1],
            modules_mastered: [-1],
            total_learn_time: 0,
            total_practice_time: 0
        },
        permissions: {
            create_modules: false,
            delete_modules: false,
            read_modules: true,
            write_modules: false
        },                    
    });
}

/**
 * Retrieves a particular user from the firebase.
 * @param email the email of the user to retrieve
 */
export const RetrieveUser = async (email: string) => {
    const q = query(collection(database, "users"), where("email", "==", email));

    const docs: DocumentData[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
    return docToUser(docs[0]);

}

/**
 * Marks a particular lesson and all of its stages as complete in the firebase for a praticular user.
 * @param userid the user to mark a lesson on
 * @param lessonid the lesson to mark down as complete
 */
export const CompleteLesson = async (userid: number, lessonid: number) => {
    const userQuery = query(collection(database, "users"), where("id", "==", userid));

    const docs: DocumentData[] = []
    const userSnapshot = await getDocs(userQuery);
    userSnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
    const user = docToUser(docs[0]);

    const lesson = await RetrieveLessonById(lessonid);

    const currentLessonsProgress = user.history.lessons_progress;

    let lessonToManipulate = currentLessonsProgress.filter((lesson) => {
        let lessonMatched = false;
        if (lesson.lessonid === lessonid) {
            lessonMatched = true;
        }
    })[0]

    let otherLessons = currentLessonsProgress.filter((lesson) => {
        let lessonNotMatched = true;
        if (lesson.lessonid === lessonid) {
            lessonNotMatched = false;
        }
        return lessonNotMatched;
    })

    if (lessonToManipulate === undefined) {
        lessonToManipulate = {
            lessonid: lessonid,
            stagesCompleted: lesson.stages
        }
    }

    lessonToManipulate.stagesCompleted = lesson.stages;

    const newLessonsProgress = [...otherLessons];
    newLessonsProgress.push(lessonToManipulate);

    const newHistory: UserHistory = {...user.history, lessons_progress: newLessonsProgress};

    return setDoc(doc(collection(database, "users"), user.username + "_" + user.id), {
        ...user,
        history: newHistory
    });
}

/**
 * Marks a particular lesson and all of its stages as not started yet in the firebase for a praticular user.
 * @param userid the user to mark a lesson on
 * @param lessonid the lesson to mark down as not started
 */
export const ResetLesson = async (userid: number, lessonid: number) => {
    const userQuery = query(collection(database, "users"), where("id", "==", userid));

    const docs: DocumentData[] = []
    const userSnapshot = await getDocs(userQuery);
    userSnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
    const user = docToUser(docs[0]);

    const currentLessonsProgress = user.history.lessons_progress;

    let lessonToManipulate = currentLessonsProgress.filter((lesson) => {
        let lessonMatched = false;
        if (lesson.lessonid === lessonid) {
            lessonMatched = true;
        }
    })[0]

    let otherLessons = currentLessonsProgress.filter((lesson) => {
        let lessonNotMatched = true;
        if (lesson.lessonid === lessonid) {
            lessonNotMatched = false;
        }
        return lessonNotMatched;
    })

    if (lessonToManipulate === undefined) {
        lessonToManipulate = {
            lessonid: lessonid,
            stagesCompleted: []
        }
    }

    lessonToManipulate.stagesCompleted = [];

    const newLessonsProgress = [...otherLessons];
    newLessonsProgress.push(lessonToManipulate);

    const newHistory: UserHistory = {...user.history, lessons_progress: newLessonsProgress};

    return setDoc(doc(collection(database, "users"), user.username + "_" + user.id), {
        ...user,
        history: newHistory
    });
}

/**
 * Marks a particular stage during a lesson as complete.
 * @param userid the user to mark a stage on
 * @param lessonid the lesson in which to mark down a stage as complete
 * @param stageid the stage to mark complete
 */
export const CompleteStage = async (userid: number, lessonid: number, stageid: number) => {
    const userQuery = query(collection(database, "users"), where("id", "==", userid));

    const docs: DocumentData[] = []
    const userSnapshot = await getDocs(userQuery);
    userSnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
    const user = docToUser(docs[0]);

    const lesson = await RetrieveLessonById(stageid);
    const stage = await RetrieveStageById(stageid);

    const currentLessonsProgress = user.history.lessons_progress;

    let lessonToManipulate = currentLessonsProgress.filter((lesson) => {
        let lessonMatched = false;
        if (lesson.lessonid === lessonid) {
            lessonMatched = true;
        }
        return lessonMatched;
    })[0]

    let otherLessons = currentLessonsProgress.filter((lesson) => {
        let lessonNotMatched = true;
        if (lesson.lessonid === lessonid) {
            lessonNotMatched = false;
        }
        return lessonNotMatched;
    })

    if (lessonToManipulate === undefined) {
        lessonToManipulate = {
            lessonid: lessonid,
            stagesCompleted: []
        }
    }

    lessonToManipulate.stagesCompleted.push(stage.id);

    const newLessonsProgress = [...otherLessons];
    newLessonsProgress.push(lessonToManipulate);

    const newHistory: UserHistory = {...user.history, lessons_progress: newLessonsProgress};

    if (lessonToManipulate.stagesCompleted.length >= lesson.stages.length) {
        return CompleteLesson(userid, lessonid);
    } else {
        return setDoc(doc(collection(database, "users"), user.username + "_" + user.id), {
            ...user,
            history: newHistory
        });
    }
}