import { StorageKey, setToStorage } from "../store";
import { ISideEffector, ActionTypes } from ".";
export const setTimerId: ISideEffector = (action, dispatch, state) => {
  if (action.type === ActionTypes.SET_TIMER_ID) {
    const { timer_id } = action.payload;
    if (timer_id) {
      setToStorage(StorageKey.TIMER_ID, timer_id);
    } else {
      localStorage.removeItem(StorageKey.TIMER_ID);
    }
  }
};
