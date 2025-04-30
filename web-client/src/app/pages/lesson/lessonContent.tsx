import { Stage } from "@/app/types/lessons";
import Image from "next/image"

interface LessonContent {
    source: string;
    alt: string;
    stage: Stage;
}

/**
 * What's displayed on the center screen on the lesson page. 
 */
export const LessonContent: React.FC<LessonContent> = ({source, alt, stage}) => {
    return (
        <div className="w-full select-none">
            <h2 className="flex justify-center mt-20 text-3xl font-bold">
                {stage.title}
            </h2>
            <div className="flex justify-center mt-10">
                <Image src={source} alt={alt} height={250} width={250} priority={true} className="w-1/5" draggable={false}/>
            </div>            
            <div className="flex justify-center mt-20 text-xl italic">
                {stage.description}
            </div>
        </div>
    )
}