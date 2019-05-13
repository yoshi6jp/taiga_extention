import { StorageKey } from "../store";
import { ISideEffector, ActionTypes } from ".";
export const signOut: ISideEffector = (action, dispatch, state) => {
  if (action.type === ActionTypes.SIGN_OUT) {
    localStorage.removeItem(StorageKey.USERNAME);
    localStorage.removeItem(StorageKey.PASSWORD);
  }
};
