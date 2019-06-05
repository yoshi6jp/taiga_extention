import { StorageKey, setToStorage } from "../store";
import { ISideEffector } from ".";
import _ from "lodash";
export const syncTaskId: ISideEffector = (action, dispatch, state) => {
  _.defer(() => {
    const { task_id } = state();
    if (task_id) {
      setToStorage(StorageKey.TASK_ID, task_id);
    } else {
      localStorage.removeItem(StorageKey.TASK_ID);
    }
  });
};
