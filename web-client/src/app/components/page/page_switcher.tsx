"use client"
import { useState } from "react";
import { HomePage } from "./home_page";
import { PracticePage } from "./practice_page";

export default function PageSwitcher() {

    const [page, setPage] = useState("home")

    return (
      <>
          {page == "home" && <HomePage setPage={setPage}/>}
          {page == "practice" && <PracticePage/>}
      </>
    );
}