import { StorageKey, setToStorageWithSubkey } from "../store";
import { ISideEffector, ActionTypes } from ".";
export const setTimelineCloseTask: ISideEffector = (
  action,
  dispatch,
  state
) => {
  if (action.type === ActionTypes.SET_TIMELIMIT_CLOSE_TASK) {
    const { timelimit_close_task } = action.payload;
    const customize = action.meta ? action.meta.customize : false;
    const { mid } = state();
    timelimit_close_task &&
      customize &&
      setToStorageWithSubkey(
        StorageKey.TIMELIMIT_CLOSE_TASK,
        mid,
        timelimit_close_task
      );
  }
};
