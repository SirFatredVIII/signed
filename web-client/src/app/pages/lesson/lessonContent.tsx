import Webcam from "@/app/components/webcam/webcam";
import { Stage } from "@/app/types/lessons";
import Image from "next/image"

interface LessonContent {
    stage: Stage;
    onComplete: () => void;
}

/**
 * What's displayed on the center screen on the lesson page. 
 */
export const LessonContent: React.FC<LessonContent> = ({stage, onComplete}) => {
    return (
        <div className="w-full select-none mb-10">
            <h2 className="flex justify-center mt-20 text-3xl font-bold">
                {stage.title}
            </h2>
            <div className="flex justify-center mt-10">
                {stage.type === "watch" &&
                    <Image src={stage.src} alt={"image for " + stage.title} height={250} width={250} priority={true} className="w-1/5" draggable={false}/>
                }
                {stage.type === "practice" &&
                    <Webcam/>
                }
            </div>            
            <div className="flex justify-center mt-20 text-xl italic">
                {stage.description}
            </div>
        </div>
    )
}