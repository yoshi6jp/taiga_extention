import { StorageKey, setToStorage, getFromStorageWithSubkey } from "../store";
import { ISideEffector, ActionTypes } from ".";
export const setPid: ISideEffector = (action, dispatch, state) => {
  if (action.type === ActionTypes.SET_PID) {
    const { pid } = action.payload;
    setToStorage(StorageKey.PID, pid);
    localStorage.removeItem(StorageKey.MID);
    const custom_eid = getFromStorageWithSubkey(StorageKey.CUSTOM_EID, pid);
    const custom_rid = getFromStorageWithSubkey(StorageKey.CUSTOM_RID, pid);
    dispatch({ type: ActionTypes.SET_CUSTOM_EID, payload: { custom_eid } });
    dispatch({ type: ActionTypes.SET_CUSTOM_RID, payload: { custom_rid } });
  }
};
