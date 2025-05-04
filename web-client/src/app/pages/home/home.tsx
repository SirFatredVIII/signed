import { Button } from "@mui/material";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { StateContext } from "../../../../context";

export const HomePage = () => {

  const [state, setState] = useState(useContext(StateContext).state);

  return (
    <>
      <h1
        className={
          "w-full flex justify-center text-7xl pt-20 italic font-bold select-none"
        }
      >
        SignEd
      </h1>
      <div className="w-full flex justify-center pt-10">
        <Button variant="contained" color="primary" onClick={() => setState({...state, currentPage: "practice"})}>
          <p className="lowercase italic">Experience the signs...</p>
        </Button>
      </div>
    </>
  );
};
