import Image from "next/image";
import FooterBar from "./components/footer_bar";

export default function Home() {
  return (
    <div>
      <h1 className={"w-full flex justify-center text-7xl pt-20 italic font-bold select-none"}>SignEd</h1>
      <FooterBar/>
    </div>
  );
}
