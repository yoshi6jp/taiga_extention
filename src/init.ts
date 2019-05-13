import { Dispatch } from "react";
import { Actions, ActionTypes } from "./actions";
import { getFromStorage, StorageKey } from "./store";
export const init = (dispatch: Dispatch<Actions>) => {
  const username = getFromStorage(StorageKey.USERNAME);
  const password = getFromStorage(StorageKey.PASSWORD);
  dispatch({ type: ActionTypes.SIGN_IN, payload: { username, password } });
};
