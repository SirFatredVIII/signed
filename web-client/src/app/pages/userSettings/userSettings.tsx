import { BaseSyntheticEvent, useContext, useState } from "react"
import { StateContext } from "../../../../context"
import { InputForm } from "@/app/components/input/form";

/**
 * A page for changing the settings of a particular user.
 */
export const UserSettingsPage = () => {

    const {state, setState} = useContext(StateContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const updateUsername = (e: BaseSyntheticEvent) => {
        setUsername(e.target.value);
    }

    return (
        <div className="bg-signed-blue h-screen -mt-15">
            <div className="pt-15 h-screen flex justify-center items-center">
                <div className="bg-signed-light-blue h-3/4 w-3/5 rounded-xl shadow-xl/30">
                    <h2 className="text-5xl text-signed-darker-blue text-center mt-10">User Settings</h2>
                    <div className="mt-10 grid grid-cols-2">
                        <InputForm type={"text"} 
                            label={"Update Username"} 
                            value={username} 
                            handler={updateUsername} 
                            errorCondition={() => {return false}} 
                            errorMessage="na" 
                            error={false}/>
                        <InputForm type={"text"} 
                            label={"Update Username"} 
                            value={username} 
                            handler={updateUsername} 
                            errorCondition={() => {return false}} 
                            errorMessage="na" 
                            error={false}/>
                    </div>
                </div>
            </div>
        </div>
    )
}