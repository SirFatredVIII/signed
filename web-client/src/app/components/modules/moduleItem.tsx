import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'

interface ModuleItemProps {
    title: string;
    disabled: boolean;
    practiceCallback: () => void;
    moduleCallback: () => void;
}

/**
 * A module as an item in a list. Most notably used
 * in our module tree.
 */
export const ModuleItem: React.FC<ModuleItemProps> = ({title, disabled, practiceCallback, moduleCallback}) => {

    let color = " hover:bg-signed-dark-blue hover:cursor-pointer bg-signed-blue ";
    let fontColor = "black"
    let span = "col-span-7"
    if (disabled) {
        color = " bg-slate-400 ";
        span = " col-span-8 "
    }

    const moduleWrapper = () => {
        if (!disabled) {
            moduleCallback();
        }
    }

    return (
        <div className="w-full grid grid-cols-8 gap-10">
            <div className={"text-5xl pl-20 pr-20 pt-5 pb-5" + color + "text-white text-center " + span} onClick={moduleWrapper}>{title}</div>
            {!disabled && <FontAwesomeIcon icon={faBook} size='4x' className='m-auto hover:cursor-pointer' color={fontColor} onClick={practiceCallback}/>}
        </div>
    )
}