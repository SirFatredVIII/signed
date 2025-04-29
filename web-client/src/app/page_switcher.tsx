"use client";
import { useContext, useEffect, useState } from "react";
import { HomePage } from "./pages/home/home";
import { PracticePage } from "./pages/practice/practice";
import { config } from "../../configuration";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { AuthenticationPage } from "./pages/auth/authPage";
import { StateContext } from "../../context";
export default function PageSwitcher() {

  const [state, setState] = useState(useContext(StateContext).state);
  const [page, setPage] = useState(state.currentPage);

  useEffect(() => {
    // Initialize the Firebase database with the provided configuration
    const database = getFirestore(config);
    
    // Reference to the admin document in the database.
    // TODO: This shit's gotta go, man, but it's a good example for now of how to access collections / documents
    const adminAccount = getDoc(doc(database, "users", "admin_0"));
    adminAccount.then((data) => {
      console.log(data.data())
    })
  });

  return (
    <>
      <StateContext.Provider value={{state: state, setState: setState}}>
        {page == "home" && <HomePage setPage={setPage} />}
        {page == "practice" && <PracticePage />}
        {(page == "signup" || page == "signin") && <AuthenticationPage />}
      </StateContext.Provider>
    </>
  );
}
