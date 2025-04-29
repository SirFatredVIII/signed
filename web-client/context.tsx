import React, { Dispatch, SetStateAction } from "react";

interface ClientState {
    currentPage: string;
    currentUser: string;
}

const initialState: ClientState = {
    currentPage: "practice",
    currentUser: "na"
}

interface IStateContext {
    state: ClientState
    setState: Dispatch<SetStateAction<ClientState>>
}

export const StateContext = React.createContext<IStateContext>(
    {
        state: initialState,
        setState: () => { }
    }
);