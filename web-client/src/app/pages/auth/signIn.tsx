import { InputButton } from "@/app/components/input/button";
import { InputForm } from "@/app/components/input/form";
import { BaseSyntheticEvent, useContext, useEffect, useState } from "react"
import { StateContext } from "../../../../context";
import { RetrieveUser } from "@/app/accessors/users.accessor";
import { hashSync } from "bcrypt-ts";
import { secret } from "./secret_salt";
import { IForm } from "./signUp";
import { User } from "@/app/types/user";

/**
 * Simple sign in component used to sign in a user to our service using their firebase credentials.
 */
export const SignIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, raiseError] = useState(false);

    const { state, setState } = useContext(StateContext);
    
    /**
     * A list of all input forms that make up the sign-up sheet. Should be quite exapandable if we ever need more.
     */
    let allForms: IForm[] = [
        {
            type: "email",
            label: "Email Address",
            value: email.toString(),
            handler: (e: BaseSyntheticEvent) => setEmail(e.target.value),
            errorCondition: () => {return !email.includes("@")},
            errorMessage: "Not a valid email address!",
            error: false
        },
        {
            type: "password",
            label: "Password",
            value: password.toString(),
            handler: (e: BaseSyntheticEvent) => setPassword(e.target.value),
            errorCondition: () => {return false},
            errorMessage: "na",
            error: false
        }
    ]

    /**
     * Event handler designed to renavigate to the sign up page.
     */
    const handleSignUp = () => {
        setState({...state, currentPage: "signup"});
    }

    /**
     * Validates the inputs received, checks the password, and authenticates the user into the rest of the program.
     */
    const handleSignIn = () => {

        // authenticate here
        RetrieveUser(email).then((user) => {
            const challenge = hashSync(password, secret)
            if (challenge !== user.pass) {
                raiseError(true);
            } else {
                raiseError(false);
                setState({...state, currentPage: "learn", currentUser: user as User});
            }
        });
    }

    // if all forms are filled out, feel free to submit the form. or at least try.
    const readyToSubmit = password.length > 3;

    return (
        <div className="pt-15">
            <div className="w-1/2 m-auto mt-50 mb-2 bg-signed-light-blue rounded-xl pb-10">
                <div>
                    <h2 className={"w-full flex justify-center text-3xl font-bold select-none text-white bg-signed-blue p-2 mb-10"}>
                        Sign In
                    </h2>
                    <div className="w-full grid justify-center mb-5">
                        {
                            allForms.map((form) => {
                                return (
                                    <InputForm type={form.type} label={form.label} handler={form.handler} value={form.value} key={form.label} errorMessage={form.errorMessage} error={form.error} errorCondition={form.errorCondition}/>
                                )
                            })
                        }
                    </div>
                    {<InputButton color="blue" label="Sign in" callback={handleSignIn} disabled={!readyToSubmit}></InputButton>}
                    {error && <div className="text-red-900 text-center">Email / Password not correct!</div>}
                </div>
            </div>
            <div className="grid justify-center mb-5 w-10vw ">
                <div className="text-signed-blue italic font-bold hover:underline hover:cursor-pointer" onClick={handleSignUp}>I want to sign up...</div>
            </div>
        </div>
    )
}