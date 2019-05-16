import { StorageKey, setToStorage } from "../store";
import { ISideEffector, ActionTypes } from ".";
export const setUrl: ISideEffector = (action, dispatch, state) => {
  if (action.type === ActionTypes.SET_URL) {
    const { url } = action.payload;
    setToStorage(StorageKey.URL, url);
  }
};
