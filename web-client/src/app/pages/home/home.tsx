import { Button } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image"; // assuming you're using Next.js
import signedLogo from "./signed.png"; // adjust the path as needed

interface HomePageProps {
  setPage: Dispatch<SetStateAction<string>>;
}

export const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  const onClick = () => {
    setPage("practice");
  };

  return (
    <div className="flex flex-col items-center w-full bg-white text-[#1D203E]">
      {/* Top Bar */}
      <div className="flex justify-center items-center w-full h-[117px] bg-[#B8CDF9] shadow-md px-9 gap-9">
        <Image src={signedLogo} alt="SignEd Logo" width={319} height={84} />
        <div className="flex gap-[200px] text-[40px] font-bold">
          <p>About Us</p>
          <p>Donate</p>
          <p>SignEd Learning Software</p>
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex flex-col items-center px-10 py-20 w-full max-w-[1920px] gap-20">
        <h1 className="text-[160px] font-bold leading-[192px] text-center max-w-[1198px]">
          Learn to sign on your own time
        </h1>
        <Button
          onClick={onClick}
          sx={{
            bgcolor: "#1D203E",
            width: "781px",
            height: "126px",
            borderRadius: "16px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            fontSize: "60px",
            fontWeight: 700,
            fontFamily: "Barlow",
            color: "#B8CDF9",
            textTransform: "none",
            "&:hover": { bgcolor: "#1D203E" },
          }}
        >
          Experience the signs...
        </Button>
        <p className="text-[60px] text-black">SignEd is free for all users</p>
      </div>
    </div>
  );
};
