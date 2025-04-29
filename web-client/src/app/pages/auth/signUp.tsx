import { InputButton } from "@/app/components/input/button";
import { InputForm } from "@/app/components/input/form";
import { BaseSyntheticEvent, useContext, useState } from "react"
import { StateContext } from "../../../../context";
import { IncrementHighestId, RetrieveHighestId } from "@/app/accessors/metadata.accessor";
import { CreateNewUser } from "@/app/accessors/users.accessor";

export interface IForm {
    type: "text" | "email" | "password", 
    label: string, 
    value: string, 
    handler: (_: BaseSyntheticEvent) => void,
    errorCondition: () => boolean, 
    errorMessage: string,
    error: boolean
}

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
    const [triedSignUp, setTriedSignUp] = useState(false);

    const { state, setState } = useContext(StateContext);
    
    /**
     * A list of all input forms that make up the sign-up sheet. Should be quite exapandable if we ever need more.
     */
    let allForms: IForm[] = [
        {
            type: "text",
            label: "Username",
            value: username.toString(),
            handler: (e: BaseSyntheticEvent) => setUsername(e.target.value),
            errorCondition: () => false,
            errorMessage: "na",
            error: false
        },
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
            type: "email",
            label: "Confirm Email Address",
            value: confirmEmail.toString(),
            handler: (e: BaseSyntheticEvent) => setConfirmEmail(e.target.value),
            errorCondition: () => {return email !== confirmEmail},
            errorMessage: "Emails don't match!",
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
        },
        {
            type: "password",
            label: "Confirm Password",
            value: confirmPassword.toString(),
            handler: (e: BaseSyntheticEvent) => setConfirmPassword(e.target.value),
            errorCondition: () => {return password !== confirmPassword},
            errorMessage: "Passwords don't match!",
            error: false
        }
    ]

    if (triedSignUp) {
            let errorFound = false;

        const newForms: { 
            type: "text" | "email" | "password", 
            label: string, 
            value: string, 
            handler: (_: BaseSyntheticEvent) => void,
            errorCondition: () => boolean, 
            errorMessage: string,
            error: boolean}[] = []

        allForms.forEach((form) => {
            if (form.errorCondition()) {
                errorFound = true;

                let newForm = {...form, error: true};

                newForms.push(newForm);
            } else {
                newForms.push(form);
            }
        })

        allForms = newForms;

    }

    /**
     * Event handler designed to renavigate to the sign in page.
     */
    const handleSignIn = () => {
        setState({...state, currentPage: "signin"});
    }

    /**
     * Validates the inputs received, creates a new Firebase user entry, and navigates to the sign in page.
     */
    const handleSignUp = () => {
        setTriedSignUp(false);
        let errorFound = false;

        const newForms: IForm[] = []
            
        allForms.forEach((form) => {
            if (form.errorCondition()) {
                errorFound = true;
                let newForm = {...form, error: true};
                newForms.push(newForm);
            } else {
                newForms.push(form);
            }
        })

        if (errorFound) {
            setTriedSignUp(true);
            allForms = newForms;
        } else {
                // after creating the new player, update the metadata of what the "highest id" is, then once that's all done,
                // we can move on to the sign in page.
                RetrieveHighestId().then((highestId) => {
                    CreateNewUser(username, highestId, password, email).then(() => {
                        IncrementHighestId(highestId).then(() => {
                            setState({...state, currentPage: "signIn"});
                    })
                })
              })
        }
    }

    // we'll show the other forms if the previous form has been typed into
    const currentForms = [allForms[0]];
    for (let i = 1; i < allForms.length; i++) {
        if (allForms[i].label !== "Username" && allForms[i - 1].value.length > 3) {
            currentForms.push(allForms[i])
        }
    }

    // if all forms are filled out, feel free to submit the form. or at least try.
    const readyToSubmit = confirmPassword.length > 3;

    return (
        <div className="pt-15">
            <div className="w-1/2 m-auto mt-50 mb-2 bg-signed-light-blue rounded-xl pb-10">
                <div>
                    <h2 className={"w-full flex justify-center text-3xl font-bold select-none text-white bg-signed-blue p-2 mb-10"}>
                        Sign Up
                    </h2>
                    <div className="w-full grid justify-center mb-5">
                        {
                            currentForms.map((form) => {
                                return (
                                    <InputForm type={form.type} label={form.label} handler={form.handler} value={form.value} key={form.label} errorMessage={form.errorMessage} error={form.error} errorCondition={form.errorCondition}/>
                                )
                            })
                        }
                    </div>
                    {readyToSubmit && <InputButton color="blue" label="Sign up" callback={handleSignUp} disabled={false}></InputButton>}
                </div>
            </div>
            <div className="grid justify-center mb-5 w-10vw ">
                <div className="text-signed-blue italic font-bold hover:underline hover:cursor-pointer" onClick={handleSignIn}>I want to sign in...</div>
            </div>
        </div>
    )
}