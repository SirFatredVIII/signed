import { User } from "@/app/types/user";
import { Module } from "@/app/types/module";
import React, { Dispatch, SetStateAction } from "react";

interface ClientState {
  currentPage: string;
  currentUser: User | "na";
  currentModule: Module | "na";
  modulePanelOpen: boolean;
}

const initialState: ClientState = {
  currentPage: "signin",
  currentUser: "na",
  currentModule: "na",
  modulePanelOpen: false,
};

export interface IStateContext {
  state: ClientState;
  setState: Dispatch<SetStateAction<ClientState>>;
}

export const StateContext = React.createContext<IStateContext>({
  state: initialState,
  setState: () => {},
});
