import React, { Dispatch, SetStateAction } from "react";

interface ClientState {
    currentPage: string;
    currentUser: string;
    modulePanelOpen: boolean;
}

const initialState: ClientState = {
    currentPage: "signup",
    currentUser: "na",
    modulePanelOpen: false
}

interface IStateContext {
    state: ClientState
    setState: Dispatch<SetStateAction<ClientState>>
}

export const StateContext = React.createContext<IStateContext>(
    {
        state: initialState,
        setState: () => {}
    }
);