import SignDetector from "@/app/components/sign_detector/sign_detector";
import { Button } from "@mui/material";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { SidebarItem } from "../lesson/sidebarItem";
import { InputButton } from "@/app/components/input/button";
import { faBookOpenReader, faHouse } from "@fortawesome/free-solid-svg-icons";
import { StateContext } from "../../../../context";
import { navigateHome, navigateLesson, navigatePractice } from "../utils/nav";

interface HomePageProps {}

export const PracticePage: React.FC<HomePageProps> = ({}) => {
  const { state, setState } = useContext(StateContext);

  return (
    <div className="grid grid-cols-10">
      <div className="bg-signed-darker-blue col-span-1 h-screen -mt-15 grid-rows-2 grid grid-rows-10">
        <div className="pt-15 border-b-5 border-b-signed-blue row-span-2">
          <SidebarItem
            label="Home"
            active={false}
            action={() => navigateHome({ state, setState })}
            icon={faHouse}
            type="actionItem"
            completed={false}
          />
          <SidebarItem
            label="Learn"
            active={false}
            action={() => navigateLesson({ state, setState })}
            icon={faBookOpenReader}
            type="actionItem"
            completed={false}
          />
          <SidebarItem
            label="Practice"
            active={true}
            action={() => navigatePractice({ state, setState })}
            icon={faBookOpenReader}
            type="actionItem"
            completed={false}
          />
        </div>
      </div>

      <div className="bg-signed-light-blue col-span-9">
        <div className="w-full select-none mb-10">
          <h2 className="flex justify-center mt-20 text-3xl font-bold">
            Practice Your Signs!
          </h2>
          <div className="flex justify-center mt-10">
            <SignDetector />
          </div>
        </div>
      </div>
    </div>
  );
};
