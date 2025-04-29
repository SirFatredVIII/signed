import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { BaseSyntheticEvent } from 'react';
import { Module } from '@/app/types/module';

interface ModuleItemProps {
    module: Module;
    practiceCallback: (e: BaseSyntheticEvent) => void;
    moduleCallback: (e: BaseSyntheticEvent) => void;
}

/**
 * A module as an item in a list. Most notably used
 * in our module tree.
 */
export const ModuleItem: React.FC<ModuleItemProps> = ({module, practiceCallback, moduleCallback}) => {

    const disabled = module.id !== 0;
    const title = module.name;

    let color = " hover:bg-signed-dark-blue hover:cursor-pointer bg-signed-blue ";
    let fontColor = "black"
    let span = "col-span-7"
    if (disabled) {
        color = " bg-slate-400 ";
        span = " col-span-8 "
    }

    const moduleWrapper = (e: BaseSyntheticEvent) => {
        if (!disabled) {
            moduleCallback(e);
        }
    }

    return (
        <div className="w-full grid grid-cols-8 gap-10">
            <div className={"text-5xl pl-20 pr-20 pt-5 pb-5" + color + "text-white text-center " + span} onClick={moduleWrapper} id={module.id.toString()}>{title}</div>
            {!disabled && <FontAwesomeIcon icon={faBook} size='4x' className='m-auto hover:cursor-pointer' color={fontColor} onClick={practiceCallback}/>}
        </div>
    )
}