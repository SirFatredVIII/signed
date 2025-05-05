import { IStateContext } from "../../../../context";

export const navigateHome = (stateContext: IStateContext) => {
  const { state, setState } = stateContext;
  setState({
    ...state,
    currentPage: "learn",
    currentModule: "na",
    modulePanelOpen: false,
  });
};

export const navigatePractice = (stateContext: IStateContext) => {
  const { state, setState } = stateContext;
  setState({ ...state, currentPage: "practice" });
};

export const navigateLesson = (stateContext: IStateContext) => {
  const { state, setState } = stateContext;
  setState({ ...state, currentPage: "lesson" });
};
