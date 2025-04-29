import React, { Dispatch, SetStateAction } from "react";

interface ClientState {
    currentPage: string;
}

const initialState: ClientState = {
    currentPage: "signup"
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