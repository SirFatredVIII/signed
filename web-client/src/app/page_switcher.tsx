"use client";
import { useState } from "react";
import { HomePage } from "./pages/home/home";
import { PracticePage } from "./pages/practice/practice";

export default function PageSwitcher() {
  const [page, setPage] = useState("home");

  return (
    <>
      {page == "home" && <HomePage setPage={setPage} />}
      {page == "practice" && <PracticePage />}
    </>
  );
}
