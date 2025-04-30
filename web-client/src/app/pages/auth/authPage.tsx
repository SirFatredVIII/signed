import { useContext } from "react";
import { StateContext } from "../../../../context";
import { SignUp } from "./signUp"
import { SignIn } from "./signIn";

/**
 * The authentication page where users will either sign in or create an entirely new profile.
 */
export const AuthenticationPage = () => {

    const { state } = useContext(StateContext);

    return (
        <div>
            <div className={"columns-2 gap-0 select-none"}>
                {/* left-hand side of the screen, deals with signing in / signing up */}
                <div className="h-screen">
                    {
                        state.currentPage === "signup" ? <SignUp /> : <SignIn />
                    }

                </div>
                {/* right-hand side of the screen, uh, I dunno, looks aesthetically pleasing */}
                <div className={"bg-signed-blue w-full h-screen"}>

                </div>
            </div>
        </div>
    )
}