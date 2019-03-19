import { Dispatch } from "react";
import { Actions } from "../actions";
import { IState } from "../store";
export const rootSideEffector = (
  action: Actions,
  dispatch: Dispatch<Actions>,
  state: IState
) => {
  console.log("side effect", action);
};
