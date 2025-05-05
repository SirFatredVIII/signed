import SignDetector from "@/app/components/sign_detector/sign_detector";
import { Stage } from "@/app/types/lessons";
import Image from "next/image";

interface LessonContent {
  stage: Stage;
  stageCompleted: boolean;
  setStageCompleted: (stageCompleted: boolean) => void;
  registerStopCamera?: (callback: () => void) => void;
}

/**
 * What's displayed on the center screen on the lesson page.
 */
export const LessonContent: React.FC<LessonContent> = ({
  stage,
  stageCompleted,
  setStageCompleted,
  registerStopCamera,
}) => {
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const expectedSigns: string[] = [];
  stage.sign.forEach((s) => expectedSigns.push(ALPHABET[s]));

  return (
    <div className="w-full select-none mb-10">
      <h2 className="flex justify-center mt-20 text-3xl font-bold">
        {stage.title}
      </h2>
      <div className="flex justify-center mt-10">
        {stage.type === "watch" && (
          <Image
            src={stage.src}
            alt={"image for " + stage.title}
            height={250}
            width={250}
            priority={true}
            className="w-1/5 scale-x-[-1]"
            draggable={false}
          />
        )}
        {stage.type === "practice" && (
          <SignDetector
            key={stage.title}
            expectedSigns={expectedSigns}
            stageCompleted={stageCompleted}
            setStageCompleted={setStageCompleted}
            registerStopCamera={registerStopCamera}
          />
        )}
      </div>
      <div className="flex justify-center mt-20 text-xl italic">
        {stageCompleted && stage.type === "practice"
          ? "Excellent! Advance when you are ready!"
          : stage.description}
      </div>
    </div>
  );
};
