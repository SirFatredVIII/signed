"use client"
import { useState } from "react";
import { HomePage } from "./home_page";

export default function PageSwitcher() {

    const [page, setPage] = useState("home")

    return (
      <>
          {page == "home" && <HomePage setPage={setPage}/>}
          {page == "practice" && <p>womp womp</p>}
      </>
    );
}