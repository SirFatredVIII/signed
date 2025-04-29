import { collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { config } from "../../../configuration";

/**
 * Accesses the firebase to retrieve the highest ID of the user to generate a new unique ID.
 */
export const RetrieveHighestId = async () => {
    const database = getFirestore(config);

    return getDoc(doc(database, "metadata", "users"));
}

/**
 * Used after a new profile has been created. Increments the "highest id" count in the firebase metadata.
 */
export const IncrementHighestId = async (newId: number) => {
    const database = getFirestore(config);

    return setDoc(doc(collection(database, "metadata"), "users"), {
        highest_id: newId          
    })
}