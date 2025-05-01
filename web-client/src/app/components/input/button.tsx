import { BaseSyntheticEvent } from "react";

interface InputButtonProps {
    color: string;
    label: string;
    callback: (_: BaseSyntheticEvent<object, any, any>) => void;
    disabled: boolean;
}

/**
 * A simple wrapper for a button that looks quite pleasant.
 */
export const InputButton: React.FC<InputButtonProps> = ({color, label, callback, disabled}) => {

    let newColors = "";
    switch (color) {
        case "indigo":
            newColors = "bg-indigo-600 text-indigo-100 hover:bg-indigo-900 hover:text-indigo-200 hover:cursor-pointer";
            break;
        case "blue":
            newColors = "bg-signed-blue text-white hover:bg-signed-dark-blue hover:text-signed-light-blue hover:cursor-pointer";
            break;
        case "green":
            newColors = "bg-emerald-600 text-white outline-3 outline-emerald-800 hover:bg-emerald-800 hover:text-emerald-100 hover:cursor-pointer";
            break;
        case "teal":
            newColors = "bg-teal-600 text-white outline-3 outline-teal-800 hover:bg-teal-800 hover:text-teal-100 hover:cursor-pointer";
            break;
        default:
            newColors = "bg-slate-400 text-slate-900 hover:bg-slate-900";
            break;
    }

    if (disabled) {
        newColors = "bg-slate-400 text-slate-900 hover:cursor-not-allowed" 
    }

    const callbackWrapper = (_: BaseSyntheticEvent) => {
        if (!disabled) {
            callback(_)
        }
    }

    return (
        <div className="grid justify-center mb-5 w-10vw">
            <button className={"rounded-xl pt-2 pb-2 pl-5 pr-5 outline-0 outline-signed-dark-blue " + newColors} onClick={callbackWrapper} disabled={disabled}>{label}</button>
        </div>
    )
}