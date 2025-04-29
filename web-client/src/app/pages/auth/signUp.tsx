import { InputButton } from "@/app/components/input/button";
import { InputForm } from "@/app/components/input/form";
import { BaseSyntheticEvent, useContext, useState } from "react"
import { StateContext } from "../../../../context";

/**
 * Simple sign up component used to sign up a user to our service and add
 * a record to our Firebase.
 */
export const SignUp = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {state, setState} = useContext(StateContext);
    
    /**
     * A list of all input forms that make up the sign-up sheet. Should be quite exapandable if we ever need more.
     */
    const allForms: { type: "text" | "email" | "password", label: string, value: string, handler: (_: BaseSyntheticEvent) => void }[] = [
        {
            type: "text",
            label: "Username",
            value: username.toString(),
            handler: (e: BaseSyntheticEvent) => setUsername(e.target.value)
        },
        {
            type: "email",
            label: "Email Address",
            value: email.toString(),
            handler: (e: BaseSyntheticEvent) => setEmail(e.target.value)
        },
        {
            type: "email",
            label: "Confirm Email Address",
            value: confirmEmail.toString(),
            handler: (e: BaseSyntheticEvent) => setConfirmEmail(e.target.value)
        },
        {
            type: "password",
            label: "Password",
            value: password.toString(),
            handler: (e: BaseSyntheticEvent) => setPassword(e.target.value)
        },
        {
            type: "password",
            label: "Confirm Password",
            value: confirmPassword.toString(),
            handler: (e: BaseSyntheticEvent) => setConfirmPassword(e.target.value)
        }
    ]

    // we'll show the other forms if the previous form has been typed into
    const currentForms = [allForms[0]];
    for (let i = 1; i < allForms.length; i++) {
        if (allForms[i].label !== "Username" && allForms[i - 1].value.length > 3) {
            currentForms.push(allForms[i])
        }
    }

    /**
     * Event handler designed to renavigate to the sign in page.
     */
    const handleSignIn = () => {
        setState({...state, currentPage: "signIn"});
    }

    return (
        <div className="pt-15">
            <div className="w-1/2 m-auto mt-50 mb-2 bg-signed-light-blue rounded-xl pb-10">
                <div>
                    <h2 className={"w-full flex justify-center text-3xl font-bold select-none text-white bg-signed-blue p-2 mb-10"}>
                        Sign Up
                    </h2>
                    <div className="w-full grid justify-center">
                        {
                            currentForms.map((form) => {
                                return (
                                    <InputForm type={form.type} label={form.label} callback={form.handler} value={form.value} key={form.label}/>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="grid justify-center mb-5 w-10vw ">
                <div className="text-signed-blue italic font-bold hover:underline hover:cursor-pointer" onClick={handleSignIn}>I want to sign in...</div>
            </div>
        </div>
    )
}