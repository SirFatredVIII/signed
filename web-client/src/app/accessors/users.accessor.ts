import { collection, doc, DocumentData, getDoc, getDocs, getFirestore, query, QueryDocumentSnapshot, setDoc, where } from "firebase/firestore";
import { config } from "../../../configuration";
import { hashSync } from "bcrypt-ts";
import { secret } from "../pages/auth/secret_salt";

/**
 * Used to hash the password according to the bcrypt standard. Requires a secret
 * salt, which you should ask Drew for if you need it.
 * @param password the password to encrypt
 * @returns the hashed password
 */
const hashPassword = (password: string) => {return hashSync(password, secret)};

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
    return docs[0];

}