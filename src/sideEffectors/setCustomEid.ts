import { StorageKey, setToStorageWithSubkey } from "../store";
import { ISideEffector, ActionTypes } from ".";
export const setCustomEid: ISideEffector = (action, dispatch, state) => {
  if (action.type === ActionTypes.SET_CUSTOM_EID) {
    const { custom_eid } = action.payload;
    const { pid } = state();
    setToStorageWithSubkey(StorageKey.CUSTOM_EID, pid, custom_eid);
  }
};
