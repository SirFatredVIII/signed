"use client";
import { useContext, useState } from "react";
import { HomePage } from "./pages/home/home";
import { PracticePage } from "./pages/practice/practice";
import { AuthenticationPage } from "./pages/auth/authPage";
import { StateContext } from "../../context";
export default function PageSwitcher() {

  const [state, setState] = useState(useContext(StateContext).state);
  const [page, setPage] = useState(state.currentPage);

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
