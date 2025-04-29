import { collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { config } from "../../../configuration";

const database = getFirestore(config);
const usersDoc = doc(database, "metadata", "users")

/**
 * Accesses the firebase to retrieve the highest ID of the user to generate a new unique ID.
 * @returns a promise to return the current highest id, as stored in our firebase
 */
export const RetrieveHighestId: () => Promise<number> = async () => {
    return getDoc(usersDoc).then((data) => data.data()?.highest_id as number);
}

/**
 * Used after a new profile has been created. Increments the "highest id" count in the firebase metadata.
 * @param newId the new id, which has already been incremented.
 */
export const IncrementHighestId = async (newId: number) => {
    return setDoc(doc(collection(database, "metadata"), "users"), {
        highest_id: newId          
    })
}

/**
 * Retrieves a list of all emails from the firebase.
 */
export const RetrieveAllEmails = async () => {
    return getDoc(usersDoc).then((data) => data.data()?.emails as string[]);
}

/**
 * Adds a new email address to the list of emails currently listed in our metadata
 * @param email the new email to add
 */
export const AddNewEmail = async (email: string) => {
    getDoc(usersDoc).then((data) => {
        const emails = data.data()?.emails as string[]
        const newEmails = [...emails];
        newEmails.push(email);
        console.log(newEmails)
        return setDoc(doc(collection(database, "metadata"), "users"), {
            emails: newEmails
        })
    })
}