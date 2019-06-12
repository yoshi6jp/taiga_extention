import { StorageKey, setToStorage, getFromStorageWithSubkey } from "../store";
import { ISideEffector, ActionTypes } from ".";
import _ from "lodash";
export const setMid: ISideEffector = (action, dispatch, state) => {
  if (action.type === ActionTypes.SET_MID) {
    const { mid } = action.payload;
    const beforeMid = state().mid;
    setToStorage(StorageKey.MID, mid);
    const biz_days = _.compact(
      getFromStorageWithSubkey(StorageKey.BIZ_DAYS, mid).split(",")
    ).sort();
    dispatch({ type: ActionTypes.SET_BIZ_DAYS, payload: { biz_days } });
    if (beforeMid && mid !== beforeMid) {
      dispatch({ type: ActionTypes.RESET_TASK_ID });
    }
  }
};
