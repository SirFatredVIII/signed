import { Button } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import SignDetector from "@/app/components/sign_detector/sign_detector";

interface HomePageProps {}

export const PracticePage: React.FC<HomePageProps> = ({}) => {
  return (
    <>
      {/* <h1 className={"w-full flex justify-center text-7xl pt-20 italic font-bold select-none"}>
            Place giant fuck-ass camera frame here
          </h1> */}
      <SignDetector />
    </>
  );
};
