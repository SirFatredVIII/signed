import { collection, DocumentData, getDocs, getFirestore, query, where } from "firebase/firestore";
import { config } from "../../../configuration";
import { Module } from "../types/module";

const database = getFirestore(config);

/**
 * Converts a firebase document to an internal module type.
 * @param document the document to convert
 * @returns a module representation of the firebase document
 */
const docToModule = (document: DocumentData) => {
    const moduleToReturn: Module = {
        id: document.id,
        name: document.name,
        skillLevel: document.skillLevel,
        prereq: document.prereq,
        signs: document.signs,
        description: document.description,
        lessons: document.lessons
    }
    return moduleToReturn;
}

/**
 * Accesses the firebase to return the specified module by its id.
 * @param id the id of the module to return
 * @returns a module object
 */
export const RetrieveModuleById = async (id: number) => {
    const q = query(collection(database, "modules"), where("id", "==", id));

    const docs: DocumentData[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });

    return docToModule(docs[0]);
}

/**
 * Accesses the firebase to return all modules in the system.
 * @param id the id of the module to return
 * @returns a list of all modules in the firebase
 */
export const RetrieveAllModules = async () => {
    const q = query(collection(database, "modules"));
    const docs: DocumentData[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });

    const modules: Module[] = []

    docs.forEach((document) => {
        modules.push(docToModule(document));
    })

    return modules;
}