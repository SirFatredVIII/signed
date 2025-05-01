"use client";
import { Button } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import styles from "./home.module.css";
import signedLogo from "./signedLogo.png";


interface HomePageProps {
  setPage: Dispatch<SetStateAction<string>>;
}

export const HomePage: React.FC<HomePageProps> = ({ setPage }) => {

  return (
    <div className="flex flex-col items-center w-full bg-white text-[#1D203E]">
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Image src={signedLogo} alt="SignEd Logo" width={319} height={84} />
        <div className={styles.navText}>
          <p>About Us</p>
          <p>Donate</p>
          <p>SignEd Learning Software</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className={styles.heroContainer}>
        <h1 className={styles.heroText}>Learn to sign on your own time</h1>

        <Button className={styles.heroButton} onClick={() => setPage("signup")}>
          SignEd Learning Software
        </Button>

        <p className="text-[60px] text-black">SignEd is free for all users</p>
      </div>
    </div>
  );
};
