import { Button } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface HomePageProps {
  setPage: Dispatch<SetStateAction<string>>;
} 

export const PracticePage: React.FC<HomePageProps> = ({setPage}) => {

    const onClick = () => {
      setPage("practice")
    }

    return (
      <>
          <h1 className={"w-full flex justify-center text-7xl pt-20 italic font-bold select-none"}>SignEd</h1>
          <div className="w-full flex justify-center pt-10">
            <Button variant="contained" color="primary" onClick={onClick}><p className="lowercase italic">Experience the signs...</p></Button>
          </div>
      </>
    );
}