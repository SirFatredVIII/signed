"use client";
import { useContext, useEffect, useState } from "react";
import { HomePage } from "./pages/home/home";
import { PracticePage } from "./pages/practice/practice";
import { AuthenticationPage } from "./pages/auth/authPage";
import { StateContext } from "../../context";
import { LearningHub } from "./pages/learn/learningHub";
import { LessonPage } from "./pages/lesson/lesson";
import { Lesson, Stage } from "./types/lessons";
import { RetrieveLessonById } from "./accessors/lessons.accessor";
import { RetrieveStageById } from "./accessors/stages.accessor";
export default function PageSwitcher() {

  const [state, setState] = useState(useContext(StateContext).state);

  const page = state.currentPage;

  return (
    <>
      <StateContext.Provider value={{state: state, setState: setState}}>
        {page == "home" && <HomePage />}
        {page == "practice" && <PracticePage />}
        {(page == "signup" || page == "signin") && <AuthenticationPage />}
        {page == "learn" && <LearningHub/>}
        {page == "lesson" && <LessonPage/>}
      </StateContext.Provider>
    </>
  );
}
