"use client";
import { useEffect, useState } from "react";
import { HomePage } from "./pages/home/home";
import { PracticePage } from "./pages/practice/practice";
import { config } from "../../configuration";
import { doc, getDoc, getFirestore } from "firebase/firestore";
export default function PageSwitcher() {
  const [page, setPage] = useState("home");

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
      {page == "home" && <HomePage setPage={setPage} />}
      {page == "practice" && <PracticePage />}
    </>
  );
}
