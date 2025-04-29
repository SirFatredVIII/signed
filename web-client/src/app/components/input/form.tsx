import { IForm } from "@/app/pages/auth/signUp";
import { BaseSyntheticEvent } from "react";

/**
 * A simple wrapper for an input form that looks quite pleasant.
 */
export const InputForm: React.FC<IForm> = ({type, label, value, handler, errorMessage, error}) => {
    return (
        <div className="grid justify-center mb-5 w-10vw">
            <label htmlFor={label} className="text-center text-signed-dark-blue font-bold">{label}</label>
            <input id={label} type={type} onChange={handler} value={value} className="border-5 border-signed-blue rounded-md pl-2 pr-2 outline-0 outline-signed-dark-blue focus:outline-2 bg-white"/>
            {error && <div className="text-red-900 text-center">{errorMessage}</div>}
        </div>
    )
}