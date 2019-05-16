import { StorageKey, setToStorageWithSubkey } from "../store";
import { ISideEffector, ActionTypes } from ".";
export const setCustomRid: ISideEffector = (action, dispatch, state) => {
  if (action.type === ActionTypes.SET_CUSTOM_RID) {
    const { custom_rid } = action.payload;
    const { pid } = state();
    setToStorageWithSubkey(StorageKey.CUSTOM_RID, pid, custom_rid);
  }
};
